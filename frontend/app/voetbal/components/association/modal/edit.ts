/**
 * Created by coen on 6-2-17.
 */

import {Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Association } from '../../../domain/association';
import { AssociationRepository } from '../../../domain/association/repository';

@Component({
    moduleId: module.id,
    selector: 'association-edit-modal-content',
    templateUrl: 'edit.html'
})
export class AssociationEditModalContent implements OnInit{
    @Input()
    association: Association;
    model: any = {};
    loading = false;
    error = '';

    constructor(
        public activeModal: NgbActiveModal,
        private repos: AssociationRepository
    ) {}

    ngOnInit() {
        if ( this.association ) {
            this.model.name = this.association.getName();
            // this.model.seasonname = moment().format('YYYY');
        }
    }

    edit(): boolean {
        this.model.name = this.model.name.trim();
        if (!this.model.name) { return false; }
        this.association.setName( this.model.name );

        this.repos.editObject( this.association )
            .subscribe(
                /* happy path */ object => {
                    this.activeModal.close( object );
                },
                /* error path */ e => { this.error = e; this.loading = false; console.log(666); },
                /* onComplete */ () => this.loading = false
            );

        return false;
    }
}