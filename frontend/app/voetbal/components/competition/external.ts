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
import { ExternalSystem } from '../../domain/external/system';
import { ExternalSystemRepository } from '../../repositories/external/system';

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

    message: any = null;

    constructor(
        private repos: CompetitionRepository,
        private route: ActivatedRoute,
        private location: Location,
        private modalService: NgbModal,
        private reposExternalSystem: ExternalSystemRepository,
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

                    this.externalsystems = externalsystems.filter( externalsystem => externalsystem.hasAvailableExportClass( Competition.constructor.name ) );

                    console.log( externalsystems );
                },
                /* error path */ e => {},
                /* onComplete */ () => {}
            );
    }

    onSelectExternalSystem( externalSystem: ExternalSystem ): void {
        // this.externalsystems = ExternalSystem.getCompetitions();
        this.externalsystem = externalSystem;

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
    }

    onImport( competition: Competition ): void {
        //this.message = null;
        /*let competition = this.competitions.find( function(item: Competition) {
         return ( item.getId() == competitionId );
         }, competitionId);*/

        //if ( competition == null) {
        //    this.message = { "type": "danger", "message": "de competitie kan niet gewijzigd worden"};
        //}

        //const modalRef = this.modalService.open(CompetitionEditModalContent, { backdrop : 'static' } );
        //modalRef.componentInstance.competition = competition;
    }

    goBack(): void {
        this.location.back();
    }
}