/**
 * Created by coen on 26-2-17.
 */

import {Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TeamRepository } from '../../../domain/team/repository'
import { Team } from '../../../domain/team';

@Component({
    moduleId: module.id,
    selector: 'team-add-modal-content',
    templateUrl: 'add.html'
})
export class TeamAddModalContent{
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

    add(): boolean {
        this.model.name = this.model.name.trim();
        if (!this.model.name) { return false; }
        let json = { "name": this.model.name, "abbreviation" : this.model.abbreviation.trim() };

        this.repos.createObject( json )
            .subscribe(
                /* happy path */ team => {
                    this.activeModal.close( team);
                },
                /* error path */ e => { this.error = e; this.loading = false; },
                /* onComplete */ () => this.loading = false
            );

        return false;
    }
}