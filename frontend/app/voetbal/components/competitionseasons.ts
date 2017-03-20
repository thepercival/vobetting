/**
 * Created by coen on 16-2-17.
 */

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Association } from '../domain/association';
import { CompetitionSeason } from '../domain/competitionseason';
import { CompetitionSeasonRepository } from '../domain/competitionseason/repository';
import { CompetitionSeasonAddModalContent } from './competitionseason/modal/add';
import { CompetitionSeasonEditModalContent } from './competitionseason/modal/edit';

// import {GlobalEventsManager} from "../../global-events-manager";

@Component({
    moduleId: module.id,
    selector: 'competitionseasons',
    templateUrl: 'competitionseasons.html'/*,
     styleUrls: [ 'competitionseason.css' ]*/

})

export class CompetitionSeasonsComponent implements OnInit{
    association: Association;
    competitionseasons: CompetitionSeason[];
    message: any = null;

    constructor(
        private repos: CompetitionSeasonRepository,
        private route: ActivatedRoute,
        private location: Location,
        private modalService: NgbModal,
        // private globalEventsManger: GlobalEventsManager
    ) {}

    ngOnInit(): void {

        // this.repos.getObjects().forEach( competitions => this.competitions = competitions);
        // this.error = null;

        this.repos.getObjects()
            .subscribe(
                /* happy path */ competitionseasons => {
                    this.competitionseasons = competitionseasons.sort((n1,n2)=> {
                        if (n1.getCompetition().getName() > n2.getCompetition().getName()) {
                            return 1;
                        }
                        if (n1.getCompetition().getName() < n2.getCompetition().getName()) {
                            return -1;
                        }
                        if (n1.getSeason().getName() < n2.getSeason().getName()) {
                            return 1;
                        }
                        if (n1.getSeason().getName() > n2.getSeason().getName()) {
                            return -1;
                        }
                        return 0;
                    });
                    console.log( this.competitionseasons );
                },
                /* error path */ e => {},
                /* onComplete */ () => {}
            );
    }

    onAdd(): void {
        this.message = null;
        const modalRef = this.modalService.open(CompetitionSeasonAddModalContent, { backdrop : 'static' } );

        modalRef.result.then((competitionseason) => {
            this.competitionseasons.push( competitionseason );
            this.message = { "type": "success", "message": "het competitieseizoen("+competitionseason.getName()+") is toegevoegd"};
        }, (reason) => {
            if ( reason ){ this.message = { "type": "danger", "message": reason}; }
        });
    }

    onEdit( competitionseason: CompetitionSeason ): void {
        this.message = null;
        /*let competitionseason = this.competitionseasons.find( function(item: CompetitionSeason) {
         return ( item.getId() == competitionseasonId );
         }, competitionseasonId);*/

        if ( competitionseason == null) {
            this.message = { "type": "danger", "message": "het competitieseizoen kan niet gewijzigd worden"};
        }

        const modalRef = this.modalService.open(CompetitionSeasonEditModalContent, { backdrop : 'static' } );
        modalRef.componentInstance.competitionseason = competitionseason;
        modalRef.result.then((competitionseason) => {
            this.message = { "type": "success", "message": "het competitieseizoen("+competitionseason.getName()+") is gewijzigd"};
        }, (reason) => {
            if ( reason ){ this.message = { "type": "danger", "message": reason}; }
        });

    }

    onRemove(competitionseasonParam: CompetitionSeason): void {
        this.message = null;
        let competitionseason = this.competitionseasons.find( function(item) {
            return ( item == this );
        }, competitionseasonParam);
        if ( competitionseason == null) {
            this.message = { "type": "danger", "message": "het competitieseizoen kan niet gevonden worden"};
        }
        this.repos.removeObject( competitionseason )
            .subscribe(
                /* happy path */ retval => {
                    let index = this.competitionseasons.indexOf( competitionseason );
                    if (index > -1) {
                        this.competitionseasons.splice(index, 1);
                        this.message = { "type": "success", "message": "competitieseizoen verwijderd"};
                    }
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; }
            );
    }

    goBack(): void {
        this.location.back();
    }
}

