/**
 * Created by coen on 5-2-17.
 */

import {Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompetitionRepository } from '../../../domain/competition/repository'
import { Competition } from '../../../domain/competition';

@Component({
    moduleId: module.id,
    selector: 'competition-add-modal-content',
    templateUrl: 'add.html'
})
export class CompetitionAddModalContent{
    model: any = {};
    loading = false;
    error = '';
    maxvalues: any = {};

    constructor(
        public activeModal: NgbActiveModal,
        private repos: CompetitionRepository
    ) {
        this.maxvalues.namemin = Competition.MIN_LENGTH_NAME;
        this.maxvalues.name = Competition.MAX_LENGTH_NAME;
        this.maxvalues.abbreviation = Competition.MAX_LENGTH_ABBREVIATION;
    }

    add(): boolean {
        this.model.name = this.model.name.trim();
        if (!this.model.name) { return false; }
        let json = { "name": this.model.name, "abbreviation" : this.model.abbreviation.trim() };

        this.repos.createObject( json )
            .subscribe(
                /* happy path */ competition => {
                    this.activeModal.close( competition);
               },
                /* error path */ e => { this.error = e; this.loading = false; },
                /* onComplete */ () => this.loading = false
            );

         return false;
    }
}