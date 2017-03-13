/**
 * Created by coen on 10-2-17.
 */

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Season } from '../../domain/season';
import { SeasonRepository } from '../../domain/season/repository';
import { SeasonAddModalContent } from './modal/add';
import { SeasonEditModalContent } from './modal/edit';
import { SeasonAddExternalModalContent } from './modal/addexternal';
import { ExternalSystem } from '../../domain/external/system';
import { ExternalObject } from '../../domain/external/object';
import { ExternalSystemRepository } from '../../domain/external/system/repository';
import { ExternalObjectRepository } from '../../domain/external/object/repository';

@Component({
    moduleId: module.id,
    selector: 'seasons-external',
    templateUrl: 'external.html'/*,
     styleUrls: [ 'season.css' ]*/

})

export class SeasonsExternalComponent implements OnInit{
    @Input()
    seasons: Season[];
    externalseasons: Season[] = [];
    externalsystem: ExternalSystem;
    externalsystems: ExternalSystem[];
    externalobjects: ExternalObject[];
    loading: boolean = false;
    message: any = null;
    classname: string;

    constructor(
        private repos: SeasonRepository,
        private route: ActivatedRoute,
        private location: Location,
        private modalService: NgbModal,
        private reposExternalSystem: ExternalSystemRepository,
        private externalObjectRepository: ExternalObjectRepository
        // private globalEventsManger: GlobalEventsManager
    ) {
        this.classname = Season.classname;
    }

    ngOnInit(): void {

        this.repos.getObjects()
            .subscribe(
                /* happy path */ seasons => {
                    this.seasons = seasons;
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                /* onComplete */ () => {}
            );

        this.reposExternalSystem.getObjects()
            .subscribe(
                /* happy path */ externalsystems => {
                    this.externalsystems = externalsystems.filter(
                        externalsystem => externalsystem.hasAvailableExportClass( this.classname )
                    );
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                /* onComplete */ () => {}
            );
    }

    onSelectExternalSystem( externalSystem: any ): void {
        this.externalsystem = externalSystem;

        externalSystem.getSeasons(this.seasons)
            .subscribe(
                /* happy path */ seasons => {
                    this.externalseasons = seasons;
                    this.selectExternalSystemHelper(seasons, this.seasons);
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                /* onComplete */ () => {}
            );
    }

    selectExternalSystemHelper( externalObjects, internalObjects ) {
        for( let externalObject of externalObjects ) {
            let foundAppAssociations = internalObjects.filter( objectFilter => objectFilter.hasExternalid( externalObject.getId().toString(), this.externalsystem ) );
            let foundAppAssociation = foundAppAssociations.shift();
            if ( foundAppAssociation ){
                let jsonExternal = { "externalid" : foundAppAssociation.getId(), "externalsystem": null };
                externalObject.addExternals(this.externalObjectRepository.jsonArrayToObject([jsonExternal],externalObject));
            }
        }
    }

    onAdd(): void {
        this.message = null;
        const modalRef = this.modalService.open(SeasonAddModalContent, { backdrop : 'static' } );

        modalRef.result.then((season) => {
            this.seasons.push( season );
            this.message = { "type": "success", "message": "het seizoen("+season.getName()+") toegevoegd"};
        }/*, (reason) => {
         modalRef.closeResult = reason;
         }*/);
    }

    onEdit( season: Season ): void {
        this.message = null;
        /*let season = this.seasons.find( function(item: Season) {
         return ( item.getId() == seasonId );
         }, seasonId);*/

        if ( season == null) {
            this.message = { "type": "danger", "message": "het seizoen kan niet gewijzigd worden"};
        }

        const modalRef = this.modalService.open(SeasonEditModalContent, { backdrop : 'static' } );
        modalRef.componentInstance.season = season;
        modalRef.result.then((season) => {
            this.message = { "type": "success", "message": "het seizoen("+season.getName()+") is gewijzigd"};
        }/*, (reason) => {
         modalRef.closeResult = reason;
         }*/);
    }

    onAddExternal( externalseason: Season): void {
        this.message = null;
        // const modalRef = this.modalService.open(SeasonAddExternalModalContent, { backdrop : 'static' } );
        //
        // modalRef.componentInstance.seasons = this.seasons.filter(
        //     season => !season.hasExternalid( externalseason.getId().toString(), this.externalsystem )
        // );
        //
        // modalRef.result.then((season) => {
        //     this.externalObjectRepository.createObject( this.repos.getUrlpostfix(), season, externalseason.getId().toString(), this.externalsystem )
        //         .subscribe(
        //             /* happy path */ externalobject => {
        //                 this.onAddExternalHelper( season, externalobject, externalseason );
        //                 this.message = { "type": "success", "message": "extern seizoen "+externalseason.getName()+" gekoppeld aan ("+season.getName()+") toegevoegd"};
        //             },
        //             /* error path */ e => { this.message = { "type": "success", "message": e}; this.loading = false; },
        //             /* onComplete */ () => this.loading = false
        //         );
        //
        // }, (reason) => {
        //  // modalRef.closeResult = reason;
        //  });
    }

    // onAddExternalHelper( season: Season, externalobject: ExternalObject, externalseason: Season ): void {
    //     // @todo following code should move to service
    //     // add to internal
    //     season.getExternals().push(externalobject);
    //     // add to external
    //     let jsonExternal = { "externalid" : season.getId(), "externalsystem": null };
    //     externalseason.addExternals(this.externalObjectRepository.jsonArrayToObject([jsonExternal],externalseason));
    // }

    onRemove( externalObject: ExternalObject ): void
    {
        // // @todo following code should move to service
        // // remove from internal
        // let internalseason = this.getSeason( externalObject.getImportableObject() );
        // if ( internalseason == null ) {
        //     this.message = { "type": "danger", "message": "intern seizoen niet gevonden"};
        //     return;
        // }
        //
        // let internalexternal = internalseason.getExternal(externalObject.getImportableObject().getId(), this.externalsystem);
        //
        // this.externalObjectRepository.removeObject( this.repos.getUrlpostfix(), internalexternal )
        //     .subscribe(
        //         /* happy path */ retval => {
        //
        //             let indextmp = internalseason.getExternals().indexOf(internalexternal);
        //             if (indextmp > -1) {
        //                 internalseason.getExternals().splice(indextmp, 1);
        //             }
        //
        //             // remove from external
        //             let externals = externalObject.getImportableObject().getExternals();
        //             let index = externals.indexOf(externalObject);
        //             if (index > -1) {
        //                 externals.splice(index, 1);
        //             }
        //
        //             this.message = { "type": "success", "message": "extern seizoen "+externalObject.getImportableObject().getName()+" ontkoppeld van ("+internalseason.getName()+") toegevoegd"};
        //         },
        //         /* error path */ e => { this.message = { "type": "danger", "message": e}; this.loading = false; },
        //         /* onComplete */ () => this.loading = false
        //     );
    }

    onImportExternalAll(): void
    {
        for( let externalseason of this.externalseasons) {
            this.onImportExternal(externalseason);
        }
    }

    onImportExternal(externalseason): void
    {
        // // check if has internal
        // // if ( false ) { // update internal
        // //     // update
        // // }
        // // else { // add
        //
        //     let json = { "name": externalseason.getName(), "startdate": externalseason.getStartdate(), "enddate": externalseason.getEnddate() };
        //
        //     this.repos.createObject( json )
        //         .subscribe(
        //             /* happy path */ season => {
        //                 this.seasons.push(season);
        //
        //                 this.externalObjectRepository.createObject( this.repos.getUrlpostfix(), season, externalseason.getId().toString(), this.externalsystem )
        //                     .subscribe(
        //                         /* happy path */ externalobject => {
        //                             this.onAddExternalHelper( season, externalobject, externalseason );
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

    getExternalObjects(importableObject: any): ExternalObject[] {
        return this.externalObjectRepository.getExternalObjects(
            this.externalobjects,
            importableObject);
    }

    getExternalObject(externalid: string, importableObject: any): ExternalObject {
        return this.externalObjectRepository.getExternalObject(
            this.externalobjects,
            this.externalsystem,
            importableObject != null ? importableObject.getId().toString() : null,
            null)
    }

    private getSeason( externalseason: Season): Season
    {
        let externalObject = this.getExternalObject(externalseason.getId().toString(),null);
        if ( externalObject == null ){
            return null;
        }
        return externalObject.getImportableObject();
    }

    getSeasonName( externalseason: Season): string
    {
        let internalseason = this.getSeason(externalseason);
        if ( internalseason == null ){
            return;
        }
        return internalseason.getName();
    }
}