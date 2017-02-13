/**
 * Created by coen on 30-1-17.
 */

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Competition } from '../domain/competition';
import { CompetitionRepository } from '../repositories/competition';
import { CompetitionAddModalContent } from './competition/modal/add';
import { CompetitionEditModalContent } from './competition/modal/edit';

// import {GlobalEventsManager} from "../../global-events-manager";

@Component({
    moduleId: module.id,
    selector: 'competitions',
    templateUrl: 'competitions.html'/*,
    styleUrls: [ 'competition.css' ]*/

})

export class CompetitionsComponent implements OnInit{
    @Input()
    competitions: Competition[];

    message: any = null;

    constructor(
        private repos: CompetitionRepository,
        private route: ActivatedRoute,
        private location: Location,
        private modalService: NgbModal,
        private competitionRepository: CompetitionRepository
        // private globalEventsManger: GlobalEventsManager
    ) {}

    ngOnInit(): void {

        // this.repos.getObjects().forEach( competitions => this.competitions = competitions);
        // this.error = null;

        this.repos.getObjects()
            .subscribe(
                /* happy path */ competitions => {
                    this.competitions = competitions;
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

    onRemove(competitionParam: Competition): void {
        this.message = null;
        let competition = this.competitions.find( function(item) {
            return ( item == this );
        }, competitionParam);
        if ( competition == null) {
            this.message = { "type": "danger", "message": "de competitie kan niet gevonden worden"};
        }
        this.competitionRepository.removeObject( competition )
             .subscribe(
                 /* happy path */ retval => {
                    let index = this.competitions.indexOf( competition );
                    if (index > -1) {
                        this.competitions.splice(index, 1);
                        this.message = { "type": "success", "message": "competitie verwijderd"};
                    }
                 },
                 /* error path */ e => { this.message = { "type": "danger", "message": e}; }
             );
    }

    goBack(): void {
        this.location.back();
    }
}
