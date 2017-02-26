/**
 * Created by coen on 26-2-17.
 */

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Team } from '../domain/team';
import { TeamRepository } from '../domain/team/repository';
import { TeamAddModalContent } from './team/modal/add';
import { TeamEditModalContent } from './team/modal/edit';

// import {GlobalEventsManager} from "../../global-events-manager";

@Component({
    moduleId: module.id,
    selector: 'teams',
    templateUrl: 'teams.html'/*,
     styleUrls: [ 'team.css' ]*/

})

export class TeamsComponent implements OnInit{
    @Input()
    teams: Team[];

    message: any = null;

    constructor(
        private repos: TeamRepository,
        private route: ActivatedRoute,
        private location: Location,
        private modalService: NgbModal
        // private globalEventsManger: GlobalEventsManager
    ) {}

    ngOnInit(): void {

        // this.repos.getObjects().forEach( teams => this.teams = teams);
        // this.error = null;

        this.repos.getObjects()
            .subscribe(
                /* happy path */ teams => {
                    this.teams = teams;
                },
                /* error path */ e => {},
                /* onComplete */ () => {}
            );
    }

    onAdd(): void {
        this.message = null;
        const modalRef = this.modalService.open(TeamAddModalContent, { backdrop : 'static' } );

        modalRef.result.then((team) => {
            this.teams.push( team );
            this.message = { "type": "success", "message": "competitie("+team.getName()+") toegevoegd"};
        }, (reason) => {
            if ( reason ){ this.message = { "type": "danger", "message": reason}; }
        });
    }

    onEdit( team: Team ): void {
        this.message = null;
        /*let team = this.teams.find( function(item: Team) {
         return ( item.getId() == teamId );
         }, teamId);*/

        if ( team == null) {
            this.message = { "type": "danger", "message": "de competitie kan niet gewijzigd worden"};
        }

        const modalRef = this.modalService.open(TeamEditModalContent, { backdrop : 'static' } );
        modalRef.componentInstance.team = team;
        modalRef.result.then((team) => {
            this.message = { "type": "success", "message": "competitie("+team.getName()+") gewijzigd"};
        }, (reason) => {
            if ( reason ){ this.message = { "type": "danger", "message": reason}; }
        });

    }

    onRemove(teamParam: Team): void {
        this.message = null;
        let team = this.teams.find( function(item) {
            return ( item == this );
        }, teamParam);
        if ( team == null) {
            this.message = { "type": "danger", "message": "de competitie kan niet gevonden worden"};
        }
        this.repos.removeObject( team )
            .subscribe(
                /* happy path */ retval => {
                    let index = this.teams.indexOf( team );
                    if (index > -1) {
                        this.teams.splice(index, 1);
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