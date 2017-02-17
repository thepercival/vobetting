/**
 * Created by coen on 30-1-17.
 */

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Association } from '../domain/association';
import { AssociationRepository } from '../domain/association/repository';
import { AssociationAddModalContent } from './association/modal/add';
import { AssociationEditModalContent } from './association/modal/edit';



// import {GlobalEventsManager} from "../../global-events-manager";

@Component({
    moduleId: module.id,
    selector: 'associations',
    templateUrl: 'associations.html'/*,
    styleUrls: [ 'association.css' ]*/

})

export class AssociationsComponent implements OnInit{
    @Input()
    associations: Association[];

    message: any = null;

    constructor(
        private repos: AssociationRepository,
        private route: ActivatedRoute,
        private location: Location,
        private modalService: NgbModal
        // private globalEventsManger: GlobalEventsManager
    ) {}

    ngOnInit(): void {

        // this.repos.getObjects().forEach( associations => this.associations = associations);
        // this.error = null;

        this.repos.getObjects()
            .subscribe(
                /* happy path */ associations => {
                    this.associations = associations;
                },
                /* error path */ e => {},
                /* onComplete */ () => {}
            );
    }

    onAdd(): void {
        this.message = null;
        const modalRef = this.modalService.open(AssociationAddModalContent, { backdrop : 'static' } );

        modalRef.result.then((association) => {
            this.associations.push( association );
            this.message = { "type": "success", "message": "de bond("+association.getName()+") is toegevoegd"};
        }, (reason) => {
            if ( reason ){ this.message = { "type": "danger", "message": reason}; }
        });
    }

    onEdit( association: Association ): void {
        this.message = null;
        /*let association = this.associations.find( function(item: Association) {
            return ( item.getId() == associationId );
        }, associationId);*/

        if ( association == null) {
            this.message = { "type": "danger", "message": "de bond kan niet gewijzigd worden"};
        }

        const modalRef = this.modalService.open(AssociationEditModalContent, { backdrop : 'static' } );
        modalRef.componentInstance.association = association;
        modalRef.result.then((association) => {
            this.message = { "type": "success", "message": "de bond("+association.getName()+") is gewijzigd"};
        }, (reason) => {
            if ( reason ){ this.message = { "type": "danger", "message": reason}; }
        });
    }

    onRemove(associationParam: Association): void {
        this.message = null;
        let association = this.associations.find( function(item) {
            return ( item == this );
        }, associationParam);
        if ( association == null) {
            this.message = { "type": "danger", "message": "de bond kan niet gevonden worden"};
        }
        this.repos.removeObject( association )
             .subscribe(
                 /* happy path */ retval => {
                    let index = this.associations.indexOf( association );
                    if (index > -1) {
                        this.associations.splice(index, 1);
                        this.message = { "type": "success", "message": "bond verwijderd"};
                    }
                 },
                 /* error path */ e => { this.message = { "type": "danger", "message": e}; }
             );
    }

    goBack(): void {
        this.location.back();
    }

}
