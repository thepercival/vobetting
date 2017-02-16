/**
 * Created by coen on 16-2-17.
 */

import {Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompetitionSeasonRepository } from '../../../domain/competitionseason/repository';
// import { Competition } from '../../../domain/competition';

@Component({
    moduleId: module.id,
    selector: 'competitionseason-add-modal-content',
    templateUrl: 'add.html'
})
export class CompetitionSeasonAddModalContent{
    model: any = {};
    loading = false;
    error = '';

    constructor(
        public activeModal: NgbActiveModal,
        private repos: CompetitionSeasonRepository
    ) {

    }

    add(): boolean {

        let json = { "name": this.model.name, "abbreviation" : this.model.abbreviation.trim() };

        // this.activeModal.close( json);
        this.repos.createObject( json )
            .subscribe(
                /* happy path */ competitionseason => {
                    this.activeModal.close(competitionseason);
                },
                /* error path */ e => { this.error = e; this.loading = false; },
                /* onComplete */ () => this.loading = false
            );

        return false;
    }
}
