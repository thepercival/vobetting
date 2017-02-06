/**
 * Created by coen on 5-2-17.
 */

import {Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AssociationRepository } from '../../../repositories/association';

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
        private associationRepository: AssociationRepository
    ) {}

    ngOnInit() {
        if ( this.association ) {
            this.model.name = this.association.name;
        }
    }

    add(): boolean {
        this.model.name = this.model.name.trim();
        if (!this.model.name) { return false; }
        let jsonAssociation = { "name": this.model.name/*, seasonname : this.model.seasonname*/ };

       this.associationRepository.createObject( jsonAssociation )
            .subscribe(
                /* happy path */ association => {
                    this.activeModal.close( association);
               },
                /* error path */ e => { this.error = e; this.loading = false; },
                /* onComplete */ () => this.loading = false
            );

        return false;
    }
}