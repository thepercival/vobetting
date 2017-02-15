/**
 * Created by coen on 6-2-17.
 */

import {Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Season } from '../../../domain/season';
import { SeasonRepository } from '../../../domain/season/repository';

@Component({
    moduleId: module.id,
    selector: 'season-edit-modal-content',
    templateUrl: 'edit.html'
})
export class SeasonEditModalContent implements OnInit{
    @Input()
    season: Season;
    model: any = {};
    loading = false;
    error = '';
    maxvalues: any = {};

    constructor(
        public activeModal: NgbActiveModal,
        private seasonRepository: SeasonRepository
    ) {
        this.maxvalues.namemin = Season.MIN_LENGTH_NAME;
        this.maxvalues.name = Season.MAX_LENGTH_NAME;
    }

    ngOnInit() {
        if ( this.season ) {
            this.model.name = this.season.getName();
            let s = this.season.getStartdate();
            this.model.startdate = { "year": s.getFullYear(), "month": s.getMonth() + 1, "day": s.getDate() };
            let e = this.season.getEnddate();
            this.model.enddate = { "year": e.getFullYear(), "month": e.getMonth() + 1, "day": e.getDate() };
        }
    }

    edit(): boolean {
        this.model.name = this.model.name.trim();
        if (!this.model.name) { return false; }

        let name = this.model.name;
        let startdate = new Date( this.model.startdate.year, this.model.startdate.month - 1, this.model.startdate.day);
        let enddate = new Date( this.model.enddate.year, this.model.enddate.month - 1, this.model.enddate.day);
        this.season.setName( name );
        this.season.setStartdate( startdate );
        this.season.setEnddate( enddate );

        this.seasonRepository.editObject( this.season )
            .subscribe(
                /* happy path */ season => {
                    // console.log(season);
                    this.activeModal.close( season);
                },
                /* error path */ e => { this.error = e; this.loading = false; },
                /* onComplete */ () => this.loading = false
            );

        return false;
    }
}