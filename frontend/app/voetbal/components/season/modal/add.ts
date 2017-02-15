/**
 * Created by coen on 5-2-17.
 */

import {Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SeasonRepository } from '../../../domain/season/repository'
import { Season } from '../../../domain/season';

@Component({
    moduleId: module.id,
    selector: 'season-add-modal-content',
    templateUrl: 'add.html'
})
export class SeasonAddModalContent{
    model: any = {};
    loading = false;
    error = '';
    maxvalues: any = {};

    constructor(
        public activeModal: NgbActiveModal,
        private repos: SeasonRepository
    ) {
        this.maxvalues.namemin = Season.MIN_LENGTH_NAME;
        this.maxvalues.name = Season.MAX_LENGTH_NAME;
    }

    add(): boolean {
        let name = this.model.name.trim();
        let startdate = new Date( this.model.startdate.year, this.model.startdate.month - 1, this.model.startdate.day);
        let enddate = new Date( this.model.enddate.year, this.model.enddate.month - 1, this.model.enddate.day);
        let json = { "name": name, "startdate" : startdate, "enddate" : enddate };

        this.repos.createObject( json )
            .subscribe(
                /* happy path */ season => {
                    this.activeModal.close(season);
               },
                /* error path */ e => { this.error = e; this.loading = false; },
                /* onComplete */ () => this.loading = false
            );

         return false;
    }
}