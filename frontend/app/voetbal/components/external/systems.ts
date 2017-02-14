/**
 * Created by cdunnink on 7-2-2017.
 */

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ExternalSystem } from '../../domain/external/system';
import { ExternalSystemRepository } from '../../repositories/external/system';
import { ExternalSystemAddModalContent } from './system/modal/add';
import { ExternalSystemEditModalContent } from './system/modal/edit';

@Component({
    moduleId: module.id,
    selector: 'externalsystems',
    templateUrl: 'systems.html'/*,
     styleUrls: [ 'association.css' ]*/
})

export class ExternalSystemsComponent implements OnInit{
    @Input()
    objects: ExternalSystem[] = [];

    message: any = null;

    constructor(
        private repos: ExternalSystemRepository,
        private route: ActivatedRoute,
        private location: Location,
        private modalService: NgbModal
    ) {}

    ngOnInit(): void {
        this.repos.getObjects()
            .subscribe(
                /* happy path */ objects => {
                    this.objects = objects;
                },
                /* error path */ e => {},
                /* onComplete */ () => {}
            );
    }

    onAdd(): void {
        this.message = null;
        const modalRef = this.modalService.open(ExternalSystemAddModalContent, { backdrop : 'static' } );

        modalRef.result.then((object) => {
            this.objects.push( object );
            this.message = { "type": "success", "message": "extern systeem("+object.getName()+") toegevoegd"};
        }, (reason) => {
        });
    }

    onEdit( object: ExternalSystem ): void {
        this.message = null;

        if ( object == null) {
            this.message = { "type": "danger", "message": "het externe systeem kan niet gewijzigd worden"};
        }

        const modalRef = this.modalService.open(ExternalSystemEditModalContent, { backdrop : 'static' } );
        modalRef.componentInstance.object = object;
        modalRef.result.then((externalsystem) => {
            this.message = { "type": "success", "message": "het externe systeem is gewijzigd"};
        }, (reason) => {
            //modalRef.closeResult = reason;
            console.error(reason);
         });
    }

    onRemove(externalSystemParam: ExternalSystem): void {
        this.message = null;
        let externalSystem = this.objects.find( function(item) {
            return ( item == this );
        }, externalSystemParam);
        if ( externalSystem == null) {
            this.message = { "type": "danger", "message": "het externe systeem kan niet gevonden worden"};
        }
        this.repos.removeObject( externalSystem )
            .subscribe(
                /* happy path */ retval => {
                    let index = this.objects.indexOf( externalSystem );
                    if (index > -1) {
                        this.objects.splice(index, 1);
                        this.message = { "type": "success", "message": "extern systeem verwijderd"};
                    }
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; }
            );
    }

    goBack(): void {
        this.location.back();
    }
}

