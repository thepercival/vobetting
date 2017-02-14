/**
 * Created by coen on 10-2-17.
 */

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Competition } from '../../domain/competition';
import { CompetitionRepository } from '../../repositories/competition';
import { CompetitionAddModalContent } from './modal/add';
import { CompetitionEditModalContent } from './modal/edit';
import { CompetitionAddExternalModalContent } from './modal/addexternal';
import { ExternalSystem } from '../../domain/external/system';
import { ExternalObject } from '../../domain/external/object';
import { ExternalSystemRepository } from '../../repositories/external/system';
import { ExternalObjectRepository } from '../../repositories/external/object';

@Component({
    moduleId: module.id,
    selector: 'competitions-external',
    templateUrl: 'external.html'/*,
     styleUrls: [ 'competition.css' ]*/

})

export class CompetitionsExternalComponent implements OnInit{
    @Input()
    competitions: Competition[];
    externalcompetitions: Competition[] = [];
    externalsystem: ExternalSystem;
    externalsystems: ExternalSystem[];
    loading: boolean = false;
    message: any = null;

    constructor(
        private repos: CompetitionRepository,
        private route: ActivatedRoute,
        private location: Location,
        private modalService: NgbModal,
        private reposExternalSystem: ExternalSystemRepository,
        private externalObjectRepository: ExternalObjectRepository
        // private globalEventsManger: GlobalEventsManager
    ) {}

    ngOnInit(): void {

        this.repos.getObjects()
            .subscribe(
                /* happy path */ competitions => {
                    this.competitions = competitions;
                },
                /* error path */ e => {},
                /* onComplete */ () => {}
            );

        this.reposExternalSystem.getObjects()
            .subscribe(
                /* happy path */ externalsystems => {
                    this.externalsystems = externalsystems.filter(
                        externalsystem => externalsystem.hasAvailableExportClass( Competition.classname )
                    );
                },
                /* error path */ e => {},
                /* onComplete */ () => {}
            );
    }

    onSelectExternalSystem( externalSystem: any ): void {
        this.externalsystem = externalSystem;

        externalSystem.getCompetitions(this.competitions)
            .subscribe(
                /* happy path */ competitions => {
                    this.externalcompetitions = competitions;
                },
                /* error path */ e => {},
                /* onComplete */ () => {}
            );
    }

    onAdd(): void {
        this.message = null;
        const modalRef = this.modalService.open(CompetitionAddModalContent, { backdrop : 'static' } );

        modalRef.result.then((competition) => {
            this.competitions.push( competition );
            this.message = { "type": "success", "message": "competitie("+competition.getName()+") toegevoegd"};
        }/*, (reason) => {
         modalRef.closeResult = reason;
         }*/);
    }

    onEdit( competition: Competition ): void {
        this.message = null;
        /*let competition = this.competitions.find( function(item: Competition) {
         return ( item.getId() == competitionId );
         }, competitionId);*/

        if ( competition == null) {
            this.message = { "type": "danger", "message": "de competitie kan niet gewijzigd worden"};
        }

        const modalRef = this.modalService.open(CompetitionEditModalContent, { backdrop : 'static' } );
        modalRef.componentInstance.competition = competition;
        modalRef.result.then((competition) => {
            this.message = { "type": "success", "message": "competitie("+competition.getName()+") gewijzigd"};
        }/*, (reason) => {
         modalRef.closeResult = reason;
         }*/);
    }

    onAddExternal( externalcompetition: Competition): void {
        this.message = null;
        const modalRef = this.modalService.open(CompetitionAddExternalModalContent, { backdrop : 'static' } );


        modalRef.componentInstance.competitions = this.competitions.filter(
            competition => !competition.hasExternalid( externalcompetition.getId().toString(), this.externalsystem )
        );

        modalRef.result.then((competition) => {
            this.externalObjectRepository.createObject( this.repos.getUrlpostfix(), competition, externalcompetition.getId().toString(), this.externalsystem )
                .subscribe(
                    /* happy path */ externalobject => {
                        // @todo following code should move to service
                        // add to internal
                        competition.getExternals().push(externalobject);
                        // add to external
                        let jsonExternal = { "externalid" : competition.getId(), "externalsystem": null };
                        externalcompetition.addExternals(this.externalObjectRepository.jsonToArrayHelper([jsonExternal],externalcompetition));
                        this.message = { "type": "success", "message": "externe competitie "+externalcompetition.getName()+" gekoppeld aan ("+competition.getName()+") toegevoegd"};
                    },
                    /* error path */ e => { this.message = { "type": "success", "message": e}; this.loading = false; },
                    /* onComplete */ () => this.loading = false
                );

        }/*, (reason) => {
         modalRef.closeResult = reason;
         }*/);
    }

    onRemove( externalObject: ExternalObject ): void
    {
        // @todo following code should move to service
        // remove from internal
        let internalcompetition = this.getCompetition( externalObject.getImportableObject() );
        if ( internalcompetition == null ) {
            this.message = { "type": "danger", "message": "interne competitie niet gevonden"};
            return;
        }

        let internalexternal = internalcompetition.getExternal(externalObject.getImportableObject().getId(), this.externalsystem);

        this.externalObjectRepository.removeObject( this.repos.getUrlpostfix(), internalexternal )
            .subscribe(
                /* happy path */ retval => {

                    let indextmp = internalcompetition.getExternals().indexOf(internalexternal);
                    if (indextmp > -1) {
                        internalcompetition.getExternals().splice(indextmp, 1);
                    }

                    // remove from external
                    let externals = externalObject.getImportableObject().getExternals();
                    let index = externals.indexOf(externalObject);
                    if (index > -1) {
                        externals.splice(index, 1);
                    }

                    this.message = { "type": "success", "message": "externe competitie "+externalObject.getImportableObject().getName()+" ontkoppeld van ("+internalcompetition.getName()+") toegevoegd"};
                },
                /* error path */ e => { this.message = { "type": "success", "message": e}; this.loading = false; },
                /* onComplete */ () => this.loading = false
            );
    }

    goBack(): void {
        this.location.back();
    }

    private getCompetition( externalcompetition: Competition): Competition
    {
        let externals = externalcompetition.getExternals();
        if ( externals.length != 1 ){
            return;
        }

        let externalid = externals[0].getExternalid();

        let foundCompetitions = this.competitions.filter(
            competition => competition.getId().toString() == externalid
        );
        if ( foundCompetitions.length != 1 ){
            return;
        }
        return foundCompetitions[0];
    }

    getCompetitionName( externalcompetition: Competition): string
    {
        let internalcompetition = this.getCompetition(externalcompetition);
        if ( internalcompetition == null ){
            return;
        }
        return internalcompetition.getName();
    }
}