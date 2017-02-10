/**
 * Created by coen on 5-2-17.
 */

import {Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ExternalSystemRepository } from '../../../../repositories/external/system';
import { ExternalSystem } from '../../../../domain/external/system';

@Component({
    moduleId: module.id,
    selector: 'externalsystem-add-modal-content',
    templateUrl: 'add.html'
})
export class ExternalSystemAddModalContent implements OnInit{
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
            this.model.website = this.object.getWebsite();
        }
    }

    add(): boolean {
        this.model.website = this.model.name.trim();
        if (!this.model.website) { return false; }
        let json = { "name": this.model.name, "website" : this.model.website };

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