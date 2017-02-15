/**
 * Created by coen on 5-2-17.
 */

import {Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AssociationRepository } from '../../../domain/association/repository';

@Component({
    moduleId: module.id,
    selector: 'association-add-modal-content',
    templateUrl: 'add.html'
})
export class AssociationAddModalContent implements OnInit{
    @Input() object;
    model: any = {};
    loading = false;
    error = '';

    constructor(
        public activeModal: NgbActiveModal,
        private repos: AssociationRepository
    ) {}

    ngOnInit() {
        if ( this.object ) {
            this.model.name = this.object.name;
        }
    }

    add(): boolean {
        this.model.name = this.model.name.trim();
        if (!this.model.name) { return false; }
        let json = { "name": this.model.name/*, seasonname : this.model.seasonname*/ };

       this.repos.createObject( json )
            .subscribe(
                /* happy path */ object => {
                    this.activeModal.close( object);
               },
                /* error path */ e => { this.error = e; this.loading = false; },
                /* onComplete */ () => this.loading = false
            );

        return false;
    }
}