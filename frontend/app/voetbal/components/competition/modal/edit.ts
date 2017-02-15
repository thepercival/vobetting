/**
 * Created by coen on 6-2-17.
 */

import {Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Competition } from '../../../domain/competition';
import { CompetitionRepository } from '../../../domain/competition/repository';

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
    maxvalues: any = {};

    constructor(
        public activeModal: NgbActiveModal,
        private competitionRepository: CompetitionRepository
    ) {
        this.maxvalues.namemin = Competition.MIN_LENGTH_NAME;
        this.maxvalues.name = Competition.MAX_LENGTH_NAME;
        this.maxvalues.abbreviation = Competition.MAX_LENGTH_ABBREVIATION;
    }

    ngOnInit() {
        if ( this.competition ) {
            this.model.name = this.competition.getName();
            this.model.abbreviation = this.competition.getAbbreviation();
        }
    }

    edit(): boolean {
        this.model.name = this.model.name.trim();
        if (!this.model.name) { return false; }
        this.competition.setName( this.model.name );
        this.competition.setAbbreviation( this.model.abbreviation );

        this.competitionRepository.editObject( this.competition )
            .subscribe(
                /* happy path */ competition => {
                    // console.log(competition);
                    this.activeModal.close( competition);
                },
                /* error path */ e => { this.error = e; this.loading = false; },
                /* onComplete */ () => this.loading = false
            );

        return false;
    }
}