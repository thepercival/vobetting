/**
 * Created by coen on 5-2-17.
 */

import {Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompetitionRepository } from '../../../repositories/competition';

@Component({
    moduleId: module.id,
    selector: 'competition-addexternal-modal-content',
    templateUrl: 'addexternal.html'
})
export class CompetitionAddExternalModalContent implements OnInit{
    @Input() competitions; // all competitions where a certain externalsystem and externalid are not yet linked
    model: any = {};
    loading = false;
    error = '';

    constructor(
        public activeModal: NgbActiveModal,
        private competitionRepository: CompetitionRepository
    ) {}

    ngOnInit() {
        this.model.competitions = this.competitions;
    }

    addExternal(): boolean {
        // this.model.name = this.model.name.trim();
        // if (!this.model.name) { return false; }
        // let jsonCompetition = { "name": this.model.name };

       // this.competitionRepository.createObject( jsonCompetition )
       //      .subscribe(
       //          /* happy path */ competition => {
       //              this.activeModal.close( competition);
       //         },
       //          /* error path */ e => { this.error = e; this.loading = false; },
       //          /* onComplete */ () => this.loading = false
       //      );

        this.error = 'implementeer het opslaan van een externe competitie aan een interne';

        return false;
    }
}