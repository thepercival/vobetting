/**
 * Created by coen on 10-2-17.
 */

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CompetitionSeason } from '../../domain/competitionseason';
import { CompetitionSeasonRepository } from '../../domain/competitionseason/repository';
import { CompetitionSeasonAddModalContent } from './modal/add';
import { CompetitionSeasonEditModalContent } from './modal/edit';
import { CompetitionSeasonAddExternalModalContent } from './modal/addexternal';
import { ExternalSystem } from '../../domain/external/system';
import { ExternalObject } from '../../domain/external/object';
import { ExternalSystemRepository } from '../../domain/external/system/repository';
import { ExternalObjectRepository } from '../../domain/external/object/repository';

@Component({
    moduleId: module.id,
    selector: 'competitionseasons-external',
    templateUrl: 'external.html'/*,
     styleUrls: [ 'competitionseason.css' ]*/

})

export class CompetitionSeasonsExternalComponent implements OnInit{
    @Input()
    competitionseasons: CompetitionSeason[];
    externalcompetitionseasons: CompetitionSeason[] = [];
    externalsystem: ExternalSystem;
    externalsystems: ExternalSystem[];
    loading: boolean = false;
    message: any = null;
    classname: string;

    constructor(
        private repos: CompetitionSeasonRepository,
        private route: ActivatedRoute,
        private location: Location,
        private modalService: NgbModal,
        private reposExternalSystem: ExternalSystemRepository,
        private externalObjectRepository: ExternalObjectRepository
        // private globalEventsManger: GlobalEventsManager
    ) {
        this.classname = CompetitionSeason.classname;
    }

    ngOnInit(): void {

        this.repos.getObjects()
            .subscribe(
                /* happy path */ competitionseasons => {
                    this.competitionseasons = competitionseasons;
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                /* onComplete */ () => {}
            );

        this.reposExternalSystem.getObjects()
            .subscribe(
                /* happy path */ externalsystems => {
                    this.externalsystems = externalsystems.filter(
                        externalsystem => externalsystem.hasAvailableExportClass( this.classname )
                    );
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                /* onComplete */ () => {}
            );
    }

    onSelectExternalSystem( externalSystem: any ): void {
        this.externalsystem = externalSystem;

        externalSystem.getCompetitionSeasons(this.competitionseasons)
            .subscribe(
                /* happy path */ competitionseasons => {
                    this.externalcompetitionseasons = competitionseasons;
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                /* onComplete */ () => {}
            );
    }

    onAdd(): void {
        this.message = null;
        const modalRef = this.modalService.open(CompetitionSeasonAddModalContent, { backdrop : 'static' } );

        modalRef.result.then((competitionseason) => {
            this.competitionseasons.push( competitionseason );
            this.message = { "type": "success", "message": "competitieseizoen("+competitionseason.getName()+") toegevoegd"};
        }/*, (reason) => {
         modalRef.closeResult = reason;
         }*/);
    }

    onEdit( competitionseason: CompetitionSeason ): void {
        this.message = null;
        /*let competitionseason = this.competitionseasons.find( function(item: CompetitionSeason) {
         return ( item.getId() == competitionseasonId );
         }, competitionseasonId);*/

        if ( competitionseason == null) {
            this.message = { "type": "danger", "message": "de competitieseizoen kan niet gewijzigd worden"};
        }

        const modalRef = this.modalService.open(CompetitionSeasonEditModalContent, { backdrop : 'static' } );
        modalRef.componentInstance.competitionseason = competitionseason;
        modalRef.result.then((competitionseason) => {
            this.message = { "type": "success", "message": "competitieseizoen("+competitionseason.getName()+") gewijzigd"};
        }/*, (reason) => {
         modalRef.closeResult = reason;
         }*/);
    }

    onAddExternal( externalcompetitionseason: CompetitionSeason): void {
        this.message = null;
        const modalRef = this.modalService.open(CompetitionSeasonAddExternalModalContent, { backdrop : 'static' } );

        modalRef.componentInstance.competitionseasons = this.competitionseasons.filter(
            competitionseason => !competitionseason.hasExternalid( externalcompetitionseason.getId().toString(), this.externalsystem )
        );

        modalRef.result.then((competitionseason) => {
            this.externalObjectRepository.createObject( this.repos.getUrlpostfix(), competitionseason, externalcompetitionseason.getId().toString(), this.externalsystem )
                .subscribe(
                    /* happy path */ externalobject => {
                        this.onAddExternalHelper( competitionseason, externalobject, externalcompetitionseason );
                        this.message = { "type": "success", "message": "externe competitieseizoen "+externalcompetitionseason.getName()+" gekoppeld aan ("+competitionseason.getName()+") toegevoegd"};
                    },
                    /* error path */ e => { this.message = { "type": "success", "message": e}; this.loading = false; },
                    /* onComplete */ () => this.loading = false
                );

        }/*, (reason) => {
         modalRef.closeResult = reason;
         }*/);
    }

    onAddExternalHelper( competitionseason: CompetitionSeason, externalobject: ExternalObject, externalcompetitionseason: CompetitionSeason ): void {
        // @todo following code should move to service
        // add to internal
        competitionseason.getExternals().push(externalobject);
        // add to external
        let jsonExternal = { "externalid" : competitionseason.getId(), "externalsystem": null };
        externalcompetitionseason.addExternals(this.externalObjectRepository.jsonToArrayHelper([jsonExternal],externalcompetitionseason));
    }

    onRemove( externalObject: ExternalObject ): void
    {
        // @todo following code should move to service
        // remove from internal
        let internalcompetitionseason = this.getCompetitionSeason( externalObject.getImportableObject() );
        if ( internalcompetitionseason == null ) {
            this.message = { "type": "danger", "message": "interne competitieseizoen niet gevonden"};
            return;
        }

        let internalexternal = internalcompetitionseason.getExternal(externalObject.getImportableObject().getId(), this.externalsystem);

        this.externalObjectRepository.removeObject( this.repos.getUrlpostfix(), internalexternal )
            .subscribe(
                /* happy path */ retval => {

                    let indextmp = internalcompetitionseason.getExternals().indexOf(internalexternal);
                    if (indextmp > -1) {
                        internalcompetitionseason.getExternals().splice(indextmp, 1);
                    }

                    // remove from external
                    let externals = externalObject.getImportableObject().getExternals();
                    let index = externals.indexOf(externalObject);
                    if (index > -1) {
                        externals.splice(index, 1);
                    }

                    this.message = { "type": "success", "message": "externe competitieseizoen "+externalObject.getImportableObject().getName()+" ontkoppeld van ("+internalcompetitionseason.getName()+") toegevoegd"};
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; this.loading = false; },
                /* onComplete */ () => this.loading = false
            );
    }

    onImportExternalAll(): void
    {
        for( let externalcompetitionseason of this.externalcompetitionseasons) {
            this.onImportExternal(externalcompetitionseason);
        }
    }

    onImportExternal(externalcompetitionseason): void
    {
        // check if has internal
        // if ( false ) { // update internal
        //     // update
        // }
        // else { // add

            let json = {
                "association": externalcompetitionseason.getAssociation(),
                "competition": externalcompetitionseason.getCompetition(),
                "season": externalcompetitionseason.getSeason()
            };

            this.repos.createObject( json )
                .subscribe(
                    /* happy path */ competitionseason => {
                        this.competitionseasons.push(competitionseason);

                        this.externalObjectRepository.createObject( this.repos.getUrlpostfix(), competitionseason, externalcompetitionseason.getId().toString(), this.externalsystem )
                            .subscribe(
                                /* happy path */ externalobject => {
                                    this.onAddExternalHelper( competitionseason, externalobject, externalcompetitionseason );
                                },
                                /* error path */ e => { this.message = { "type": "danger", "message": e}; this.loading = false; },
                                /* onComplete */ () => this.loading = false
                            );

                    },
                    /* error path */ e => { this.message = { "type": "danger", "message": e}; this.loading = false; },
                    /* onComplete */ () => this.loading = false
                );
        // }
    }

    goBack(): void {
        this.location.back();
    }

    private getCompetitionSeason( externalcompetitionseason: CompetitionSeason): CompetitionSeason
    {
        let externals = externalcompetitionseason.getExternals();
        if ( externals.length != 1 ){
            return;
        }

        let externalid = externals[0].getExternalid();

        let foundCompetitionSeasons = this.competitionseasons.filter(
            competitionseason => competitionseason.getId().toString() == externalid
        );
        if ( foundCompetitionSeasons.length != 1 ){
            return;
        }
        return foundCompetitionSeasons[0];
    }

    getCompetitionSeasonName( externalcompetitionseason: CompetitionSeason): string
    {
        let internalcompetitionseason = this.getCompetitionSeason(externalcompetitionseason);
        if ( internalcompetitionseason == null ){
            return;
        }
        return internalcompetitionseason.getName();
    }
}