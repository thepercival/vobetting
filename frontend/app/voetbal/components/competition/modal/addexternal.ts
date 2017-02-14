/**
 * Created by coen on 5-2-17.
 */

import {Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Competition } from '../../../domain/competition';

@Component({
    moduleId: module.id,
    selector: 'competition-addexternal-modal-content',
    templateUrl: 'addexternal.html'
})
export class CompetitionAddExternalModalContent implements OnInit{
    @Input() competitions:Competition[]; // all competitions where a certain externalsystem and externalid are not yet linked
    model: any = {};

    loading = false;
    error = '';

    constructor(
        public activeModal: NgbActiveModal
    ) {

    }

    ngOnInit() {
        this.model.competitions = this.competitions;
    }

    addExternal(competition): boolean {
       this.activeModal.close(competition);
       return false;
    }
}