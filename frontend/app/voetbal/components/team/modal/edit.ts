/**
 * Created by coen on 26-2-17.
 */

import {Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Team } from '../../../domain/team';
import { TeamRepository } from '../../../domain/team/repository';

@Component({
    moduleId: module.id,
    selector: 'team-edit-modal-content',
    templateUrl: 'edit.html'
})
export class TeamEditModalContent implements OnInit{
    @Input()
    team: Team;
    model: any = {};
    loading = false;
    error = '';
    maxvalues: any = {};


    constructor(
        public activeModal: NgbActiveModal,
        private repos: TeamRepository
    ) {
        this.maxvalues.namemin = Team.MIN_LENGTH_NAME;
        this.maxvalues.name = Team.MAX_LENGTH_NAME;
        this.maxvalues.abbreviation = Team.MAX_LENGTH_ABBREVIATION;
    }

    ngOnInit() {
        if ( this.team ) {
            this.model.name = this.team.getName();
            this.model.abbreviation = this.team.getAbbreviation();
        }
    }

    edit(): boolean {
        this.model.name = this.model.name.trim();
        if (!this.model.name) { return false; }
        this.team.setName( this.model.name );
        this.team.setAbbreviation( this.model.abbreviation );

        this.repos.editObject( this.team )
            .subscribe(
                /* happy path */ team => {
                    // console.log(team);
                    this.activeModal.close( team);
                },
                /* error path */ e => { this.error = e; this.loading = false; },
                /* onComplete */ () => this.loading = false
            );

        return false;
    }
}