/**
 * Created by coen on 10-2-17.
 */

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Association } from '../../domain/association';
import { AssociationRepository } from '../../domain/association/repository';
import { AssociationAddModalContent } from './modal/add';
import { AssociationEditModalContent } from './modal/edit';
import { AssociationAddExternalModalContent } from './modal/addexternal';
import { ExternalSystem } from '../../domain/external/system';
import { ExternalObject } from '../../domain/external/object';
import { ExternalSystemRepository } from '../../domain/external/system/repository';
import { ExternalObjectRepository } from '../../domain/external/object/repository';

@Component({
    moduleId: module.id,
    selector: 'associations-external',
    templateUrl: 'external.html'/*,
     styleUrls: [ 'association.css' ]*/

})

export class AssociationsExternalComponent implements OnInit{
    @Input()
    associations: Association[];
    externalassociations: Association[] = [];
    externalsystem: ExternalSystem;
    externalsystems: ExternalSystem[];
    loading: boolean = false;
    message: any = null;
    classname: string;

    constructor(
        private repos: AssociationRepository,
        private route: ActivatedRoute,
        private location: Location,
        private modalService: NgbModal,
        private reposExternalSystem: ExternalSystemRepository,
        private externalObjectRepository: ExternalObjectRepository
        // private globalEventsManger: GlobalEventsManager
    ) {
        this.classname = Association.classname;
    }

    ngOnInit(): void {

        this.repos.getObjects()
            .subscribe(
                /* happy path */ associations => {
                    this.associations = associations;
                },
                /* error path */ e => {},
                /* onComplete */ () => {}
            );

        this.reposExternalSystem.getObjects()
            .subscribe(
                /* happy path */ externalsystems => {
                    this.externalsystems = externalsystems.filter(
                        externalsystem => externalsystem.hasAvailableExportClass( this.classname )
                    );
                },
                /* error path */ e => {},
                /* onComplete */ () => {}
            );
    }

    onSelectExternalSystem( externalSystem: any ): void {
        this.externalsystem = externalSystem;

        externalSystem.getAssociations(this.associations)
            .subscribe(
                /* happy path */ associations => {
                    this.externalassociations = associations;
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
            this.message = { "type": "success", "message": "bond("+association.getName()+") toegevoegd"};
        }/*, (reason) => {
         modalRef.closeResult = reason;
         }*/);
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
            this.message = { "type": "success", "message": "bond("+association.getName()+") gewijzigd"};
        }/*, (reason) => {
         modalRef.closeResult = reason;
         }*/);
    }

    onAddExternal( externalassociation: Association): void {
        this.message = null;
        const modalRef = this.modalService.open(AssociationAddExternalModalContent, { backdrop : 'static' } );

        modalRef.componentInstance.associations = this.associations.filter(
            association => !association.hasExternalid( externalassociation.getId().toString(), this.externalsystem )
        );

        modalRef.result.then((association) => {
            this.externalObjectRepository.createObject( this.repos.getUrlpostfix(), association, externalassociation.getId().toString(), this.externalsystem )
                .subscribe(
                    /* happy path */ externalobject => {
                        this.onAddExternalHelper( association, externalobject, externalassociation );
                        this.message = { "type": "success", "message": "externe bond "+externalassociation.getName()+" gekoppeld aan ("+association.getName()+") toegevoegd"};
                    },
                    /* error path */ e => { this.message = { "type": "success", "message": e}; this.loading = false; },
                    /* onComplete */ () => this.loading = false
                );

        }/*, (reason) => {
         modalRef.closeResult = reason;
         }*/);
    }

    onAddExternalHelper( association: Association, externalobject: ExternalObject, externalassociation: Association ): void {
        // @todo following code should move to service
        // add to internal
        association.getExternals().push(externalobject);
        // add to external
        let jsonExternal = { "externalid" : association.getId(), "externalsystem": null };
        externalassociation.addExternals(this.externalObjectRepository.jsonToArrayHelper([jsonExternal],externalassociation));
    }

    onRemove( externalObject: ExternalObject ): void
    {
        // @todo following code should move to service
        // remove from internal
        let internalassociation = this.getAssociation( externalObject.getImportableObject() );
        if ( internalassociation == null ) {
            this.message = { "type": "danger", "message": "interne bond niet gevonden"};
            return;
        }

        let internalexternal = internalassociation.getExternal(externalObject.getImportableObject().getId(), this.externalsystem);

        this.externalObjectRepository.removeObject( this.repos.getUrlpostfix(), internalexternal )
            .subscribe(
                /* happy path */ retval => {

                    let indextmp = internalassociation.getExternals().indexOf(internalexternal);
                    if (indextmp > -1) {
                        internalassociation.getExternals().splice(indextmp, 1);
                    }

                    // remove from external
                    let externals = externalObject.getImportableObject().getExternals();
                    let index = externals.indexOf(externalObject);
                    if (index > -1) {
                        externals.splice(index, 1);
                    }

                    this.message = { "type": "success", "message": "externe bond "+externalObject.getImportableObject().getName()+" ontkoppeld van ("+internalassociation.getName()+") toegevoegd"};
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; this.loading = false; },
                /* onComplete */ () => this.loading = false
            );
    }

    onImportExternalAll(): void
    {
        for( let externalassociation of this.externalassociations) {
            this.onImportExternal(externalassociation);
        }
    }

    onImportExternal(externalassociation): void
    {
        // check if has internal
        // if ( false ) { // update internal
        //     // update
        // }
        // else { // add

            let json = { "name": externalassociation.getName() };

            this.repos.createObject( json )
                .subscribe(
                    /* happy path */ association => {
                        this.associations.push(association);

                        this.externalObjectRepository.createObject( this.repos.getUrlpostfix(), association, externalassociation.getId().toString(), this.externalsystem )
                            .subscribe(
                                /* happy path */ externalobject => {
                                    this.onAddExternalHelper( association, externalobject, externalassociation );
                                },
                                /* error path */ e => { this.message = { "type": "danger", "message": e}; this.loading = false; },
                                /* onComplete */ () => this.loading = false
                            );

                    },
                    /* error path */ e => { this.message = { "type": "danger", "message": e}; this.loading = false; },
                    /* onComplete */ () => this.loading = false
                );
        // }
    }

    goBack(): void {
        this.location.back();
    }

    private getAssociation( externalassociation: Association): Association
    {
        let externals = externalassociation.getExternals();
        if ( externals.length != 1 ){
            return;
        }

        let externalid = externals[0].getExternalid();

        let foundAssociations = this.associations.filter(
            association => association.getId().toString() == externalid
        );
        if ( foundAssociations.length != 1 ){
            return;
        }
        return foundAssociations[0];
    }

    getAssociationName( externalassociation: Association): string
    {
        let internalassociation = this.getAssociation(externalassociation);
        if ( internalassociation == null ){
            return;
        }
        return internalassociation.getName();
    }
}