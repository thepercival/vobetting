/**
 * Created by coen on 6-2-17.
 */

import {Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Competition } from '../../../domain/competition';
import { CompetitionRepository } from '../../../repositories/competition';

@Component({
    moduleId: module.id,
    selector: 'competition-edit-modal-content',
    templateUrl: 'edit.html'
})
export class CompetitionEditModalContent implements OnInit{
    @Input()
    competition: Competition;
    model: any = {};
    loading = false;
    error = '';

    constructor(
        public activeModal: NgbActiveModal,
        private competitionRepository: CompetitionRepository
    ) {}

    ngOnInit() {
        if ( this.competition ) {
            this.model.name = this.competition.getName();
            // this.model.seasonname = moment().format('YYYY');
        }
    }

    edit(): boolean {
        this.model.name = this.model.name.trim();
        if (!this.model.name) { return false; }
        let jsonCompetition = { "name": this.model.name/*, seasonname : this.model.seasonname*/ };
        this.competition.setName( this.model.name );

        this.competitionRepository.editObject( this.competition )
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