/**
 * Created by coen on 5-2-17.
 */

import {Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompetitionSeason } from '../../../domain/competitionseason';

@Component({
    moduleId: module.id,
    selector: 'competitionseason-addexternal-modal-content',
    templateUrl: 'addexternal.html'
})
export class CompetitionSeasonAddExternalModalContent implements OnInit{
    @Input() competitionseasons:CompetitionSeason[]; // all competitionseasons where a certain externalsystem and externalid are not yet linked
    model: any = {};
    loading = false;
    error = '';


    constructor(
        public activeModal: NgbActiveModal
    ) {

    }

    ngOnInit() {
        this.model.competitionseasons = this.competitionseasons;
    }

    addExternal(competitionseason): boolean {
       this.activeModal.close(competitionseason);
       return false;
    }
}