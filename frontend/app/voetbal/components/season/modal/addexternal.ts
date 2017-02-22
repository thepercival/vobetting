/**
 * Created by coen on 5-2-17.
 */

import {Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Season } from '../../../domain/season';

@Component({
    moduleId: module.id,
    selector: 'season-addexternal-modal-content',
    templateUrl: 'addexternal.html'
})
export class SeasonAddExternalModalContent implements OnInit{
    @Input() seasons:Season[]; // all seasons where a certain externalsystem and externalid are not yet linked
    model: any = {};
    loading = false;
    error = '';

    constructor(
        public activeModal: NgbActiveModal
    ) {

    }

    ngOnInit() {
        this.model.seasons = this.seasons;
    }

    addExternal(season): boolean {
       this.activeModal.close(season);
       return false;
    }
}