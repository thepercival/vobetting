/**
 * Created by coen on 5-2-17.
 */

import {Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompetitionRepository } from '../../../repositories/competition';

@Component({
    moduleId: module.id,
    selector: 'competition-add-modal-content',
    templateUrl: 'add.html'
})
export class CompetitionAddModalContent implements OnInit{
    @Input() competition;
    model: any = {};
    loading = false;
    error = '';

    constructor(
        public activeModal: NgbActiveModal,
        private competitionRepository: CompetitionRepository
    ) {}

    ngOnInit() {
        if ( this.competition ) {
            this.model.name = this.competition.name;
        }
    }

    add(): boolean {
        this.model.name = this.model.name.trim();
        if (!this.model.name) { return false; }
        let jsonCompetition = { "name": this.model.name/*, seasonname : this.model.seasonname*/ };

       this.competitionRepository.createObject( jsonCompetition )
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