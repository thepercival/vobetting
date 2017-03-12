/**
 * Created by coen on 10-2-17.
 */

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs/Rx';

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
    externalobjects: ExternalObject[];
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

        let observables = Observable.create(observer => {
            this.repos.getObjects()
                .subscribe(
                    /* happy path */ associations => {
                        this.associations = associations;
                        observer.next(this.associations );
                        if ( this.externalsystems != null ){
                            observer.complete();
                        }
                    },
                    /* error path */ e => {
                        this.message = {"type": "danger", "message": e};
                    }
                );

            this.reposExternalSystem.getObjects()
                .subscribe(
                    /* happy path */ externalsystems => {
                        this.externalsystems = externalsystems.filter(
                            externalsystem => externalsystem.hasAvailableExportClass(this.classname)
                        );
                        observer.next(this.externalsystems );
                        if ( this.associations != null ){
                            observer.complete();
                        }
                    },
                    /* error path */ e => {
                        this.message = {"type": "danger", "message": e};
                    }
                );
        });

        observables
            .subscribe(
                /* happy path */ test => {
                    if ( this.associations != null && this.externalsystems != null && this.externalobjects == null ){
                        this.externalObjectRepository.getObjects(this.repos)
                            .subscribe(
                                /* happy path */ externalobjects => {
                                    this.externalobjects = externalobjects;
                                    console.log(externalobjects);
                                },
                                /* error path */ e => {
                                    this.message = {"type": "danger", "message": e};
                                },
                                /* onComplete */ () => {
                                }
                            );
                        //
                    }
                },
                /* error path */ e => {
                    this.message = {"type": "danger", "message": e};
                },
                /* onComplete */ () => {
                }
            );
    }

    getExternalObjects(association: Association): ExternalObject[] {
        if ( this.externalobjects == null){
            return [];
        }
        return this.externalobjects.filter(
            extobjIt => extobjIt.getImportableObject() == association
        );
    }

    getExternalObject(externalsystem: any, externalid: string, importableObject: any): ExternalObject {
        return this.externalobjects.filter(
            extobjIt => extobjIt.getExternalSystem() == externalsystem
                && ( externalid == null || extobjIt.getExternalid() == externalid )
                && ( importableObject == null || extobjIt.getExternalid() == externalid )
        ).shift();
    }

    onSelectExternalSystem( externalSystem: any ): void {
        this.externalsystem = externalSystem;

        externalSystem.getAssociations()
            .subscribe(
                /* happy path */ associations => {
                    this.externalassociations = associations;
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; },
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

        // alle bonden die nog niet gekoppeld zijn
        modalRef.componentInstance.associations = this.associations.filter(
            associationIt => this.getExternalObject(this.externalsystem, externalassociation.getId().toString(), associationIt ) == null
        );

        modalRef.result.then((association) => {
            this.externalObjectRepository.createObject( this.repos, association, externalassociation.getId().toString(), this.externalsystem )
                .subscribe(
                    /* happy path */ externalObject => {
                        console.log(externalObject);
                        this.externalobjects.push(externalObject);
                        this.message = { "type": "success", "message": "externe bond "+externalassociation.getName()+" gekoppeld aan ("+association.getName()+") toegevoegd"};
                    },
                    /* error path */ e => { this.message = { "type": "success", "message": e}; this.loading = false; },
                    /* onComplete */ () => this.loading = false
                );

        }, (reason) => {
         // modalRef.closeResult = reason;
         });
    }

    onRemove( externalObject: ExternalObject ): void
    {
        this.externalObjectRepository.removeObject( this.repos.getUrlpostfix(), externalObject )
            .subscribe(
                /* happy path */ retval => {

                    let index = this.externalobjects.indexOf(externalObject);
                    if (index > -1) {
                        this.externalobjects.splice(index, 1);
                    }

                    this.message = { "type": "success", "message": "externe bond "+externalObject.getExternalid()+" ontkoppeld van "+externalObject.getImportableObject().getName()};
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
        // // check if has internal
        // // if ( false ) { // update internal
        // //     // update
        // // }
        // // else { // add
        //
        //     let json = { "name": externalassociation.getName() };
        //
        //     this.repos.createObject( json )
        //         .subscribe(
        //             /* happy path */ association => {
        //                 this.associations.push(association);
        //
        //                 this.externalObjectRepository.createObject( this.repos.getUrlpostfix(), association, externalassociation.getId().toString(), this.externalsystem )
        //                     .subscribe(
        //                         /* happy path */ externalobject => {
        //                             this.onAddExternalHelper( association, externalobject, externalassociation );
        //                         },
        //                         /* error path */ e => { this.message = { "type": "danger", "message": e}; this.loading = false; },
        //                         /* onComplete */ () => this.loading = false
        //                     );
        //
        //             },
        //             /* error path */ e => { this.message = { "type": "danger", "message": e}; this.loading = false; },
        //             /* onComplete */ () => this.loading = false
        //         );
        // // }
    }

    goBack(): void {
        this.location.back();
    }

    private getAssociation( externalassociation: Association): Association
    {
        let externalObject = this.getExternalObject(this.externalsystem, externalassociation.getId().toString(), null);
        if ( externalObject == null ){
            return null;
        }
        return externalObject.getImportableObject();
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