/**
 * Created by coen on 26-2-17.
 */

import {Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Team } from '../../../domain/team';

@Component({
    moduleId: module.id,
    selector: 'team-addexternal-modal-content',
    templateUrl: 'addexternal.html'
})
export class TeamAddExternalModalContent implements OnInit{
    @Input() teams:Team[]; // all teams where a certain externalsystem and externalid are not yet linked
    model: any = {};

    loading = false;
    error = '';

    constructor(
        public activeModal: NgbActiveModal
    ) {

    }

    ngOnInit() {
        this.model.teams = this.teams;
    }

    addExternal(team): boolean {
        this.activeModal.close(team);
        return false;
    }
}