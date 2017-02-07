/**
 * Created by coen on 6-2-17.
 */

import {Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ExternalSystem } from '../../../../domain/external/system';
import { ExternalSystemRepository } from '../../../../repositories/external/system';

@Component({
    moduleId: module.id,
    selector: 'externalsystem-edit-modal-content',
    templateUrl: 'edit.html'
})
export class ExternalSystemEditModalContent implements OnInit{
    @Input()
    object: ExternalSystem;
    model: any = {};
    loading = false;
    error = '';

    constructor(
        public activeModal: NgbActiveModal,
        private repos: ExternalSystemRepository
    ) {}

    ngOnInit() {
        if ( this.object ) {
            this.model.name = this.object.getName();
            // this.model.seasonname = moment().format('YYYY');
        }
    }

    edit(): boolean {
        this.model.name = this.model.name.trim();
        if (!this.model.name) { return false; }
        // let jsonAssociation = { "name": this.model.name/*, seasonname : this.model.seasonname*/ };
        this.object.setName( this.model.name );

        this.repos.editObject( this.object )
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