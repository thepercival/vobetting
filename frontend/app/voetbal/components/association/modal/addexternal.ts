/**
 * Created by coen on 5-2-17.
 */

import {Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Association } from '../../../domain/association';

@Component({
    moduleId: module.id,
    selector: 'association-addexternal-modal-content',
    templateUrl: 'addexternal.html'
})
export class AssociationAddExternalModalContent implements OnInit{
    @Input() associations:Association[]; // all associations where a certain externalsystem and externalid are not yet linked
    model: any = {};
    loading = false;
    error = '';

    constructor(
        public activeModal: NgbActiveModal
    ) {

    }

    ngOnInit() {
        this.model.associations = this.associations;
    }

    addExternal(association): boolean {
       this.activeModal.close(association);
       return false;
    }
}