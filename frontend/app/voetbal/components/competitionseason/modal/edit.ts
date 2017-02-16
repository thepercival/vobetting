/**
 * Created by coen on 16-2-17.
 */

import {Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompetitionSeason } from '../../../domain/competitionseason';
import { CompetitionSeasonRepository } from '../../../domain/competitionseason/repository';

@Component({
    moduleId: module.id,
    selector: 'competitionseason-edit-modal-content',
    templateUrl: 'edit.html'
})
export class CompetitionSeasonEditModalContent implements OnInit{
    @Input()
    competitionseason: CompetitionSeason;
    model: any = {};
    loading = false;
    error = '';

    constructor(
        public activeModal: NgbActiveModal,
        private repos: CompetitionSeasonRepository
    ) {

    }

    ngOnInit() {
        if ( this.competitionseason ) {
            //this.model.name = this.competition.getName();
            //this.model.abbreviation = this.competition.getAbbreviation();
        }
    }

    edit(): boolean {
        // this.model.name = this.model.name.trim();
        // if (!this.model.name) { return false; }
        // this.competition.setName( this.model.name );
        // this.competition.setAbbreviation( this.model.abbreviation );

        this.repos.editObject( this.competitionseason )
            .subscribe(
                /* happy path */ competitionseason => {
                    // console.log(competitionseason);
                    this.activeModal.close(competitionseason);
                },
                /* error path */ e => { this.error = e; this.loading = false; },
                /* onComplete */ () => this.loading = false
            );

        return false;
    }
}
