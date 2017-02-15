/**
 * Created by coen on 6-2-17.
 */

import {Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ExternalSystem } from '../../../../domain/external/system';
import { ExternalSystemRepository } from '../../../../domain/external/system/repository';

@Component({
    moduleId: module.id,
    selector: 'externalsystem-edit-modal-content',
    templateUrl: 'edit.html'
})
export class ExternalSystemEditModalContent implements OnInit{
    @Input()
    object: ExternalSystem;
    model: any = {};
    maxvalues: any = {};
    loading = false;
    error = '';

    constructor(
        public activeModal: NgbActiveModal,
        private repos: ExternalSystemRepository
    ) {
        this.maxvalues.name = ExternalSystem.MAX_LENGTH_NAME;
        this.maxvalues.website = ExternalSystem.MAX_LENGTH_WEBSITE;
        this.maxvalues.username = ExternalSystem.MAX_LENGTH_USERNAME;
        this.maxvalues.password = ExternalSystem.MAX_LENGTH_PASSWORD
        this.maxvalues.apiurl = ExternalSystem.MAX_LENGTH_APIURL;
        this.maxvalues.apikey = ExternalSystem.MAX_LENGTH_APIKEY;
    }

    ngOnInit() {
        if ( this.object ) {
            this.model.name = this.object.getName();
            this.model.website = this.object.getWebsite();
            this.model.username = this.object.getUsername();
            this.model.password = this.object.getPassword();
            this.model.apiurl = this.object.getApiurl();
            this.model.apikey = this.object.getApikey();
        }
    }

    edit(): boolean {
        this.model.name = this.model.name.trim();
        if (!this.model.name) { return false; }
        // console.log(this.object);
        this.object.setName( this.model.name );
        this.object.setWebsite( this.model.website );
        this.object.setUsername( this.model.username );
        this.object.setPassword( this.model.password );
        this.object.setApiurl( this.model.apiurl );
        this.object.setApikey( this.model.apikey );
        //console.log(this.object);
        this.repos.editObject( this.object )
            .subscribe(
                /* happy path */ object => {
                    this.activeModal.close( object);
                    //console.log(object);
                },
                /* error path */ e => { this.error = e; this.loading = false; },
                /* onComplete */ () => this.loading = false
            );



        return false;
    }
}