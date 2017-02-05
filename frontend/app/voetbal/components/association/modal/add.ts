/**
 * Created by coen on 5-2-17.
 */

import {Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Association } from '../../../domain/association';
import { AssociationRepository } from '../../../repositories/association';
//import { CompetitionSeasonInMemoryService } from '../service.inmemory';
import * as moment from 'moment/moment';

@Component({
    moduleId: module.id,
    selector: 'association-add-modal-content',
    templateUrl: 'add.html'
})
export class AssociationAddModalContent implements OnInit{
    @Input() association;
    model: any = {};
    loading = false;
    error = '';

    constructor(
        public activeModal: NgbActiveModal,
        private router: Router,
        private associationRepository: AssociationRepository
    ) {}

    ngOnInit() {
        if ( this.association ) {
            this.model.name = this.association.name;
            // this.model.seasonname = moment().format('YYYY');
        }
    }

    add(): boolean {
        this.model.name = this.model.name.trim();
        if (!this.model.name) { return false; }
        // this.model.seasonname = this.model.seasonname.trim();
        // if (!this.model.seasonname) { return; }
        //
        // let service = this.demo ? this.competitionSeasonInMemoryService : this.competitionSeasonService;
        //
        let jsonAssociation = { "name": this.model.name/*, seasonname : this.model.seasonname*/ };

        //
        this.associationRepository.createObject( jsonAssociation )
            .subscribe(
                /* happy path */ association => {
                    // this.router.navigate(['/associations'/*, cs.id*/ ]); // met id
                    this.activeModal.close( association);
               },
                /* error path */ e => { this.error = e; this.loading = false; },
                /* onComplete */ () => this.loading = false
            );
        // //service.createObject( competitionSeason )
        // //  .forEach(competitionseason => console.log( competitionseason ) );


        return false;
    }
}