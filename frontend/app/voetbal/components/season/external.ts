/**
 * Created by coen on 10-2-17.
 */

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs/Rx';

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

        let observables = Observable.create(observer => {
            this.repos.getObjects()
                .subscribe(
                    /* happy path */ seasons => {
                        this.seasons = seasons;
                        if ( this.seasons != null && this.externalsystems  ){
                            observer.next(true);
                            observer.complete();
                        }
                    },
                    /* error path */ e => { this.message = {"type": "danger", "message": e}; }
                );

            this.reposExternalSystem.getObjects()
                .subscribe(
                    /* happy path */ externalsystems => {
                        this.externalsystems = externalsystems.filter(
                            externalsystem => externalsystem.hasAvailableExportClass(this.classname)
                        );
                        if ( this.seasons != null && this.externalsystems  ){
                            observer.next(true);
                            observer.complete();
                        }
                    },
                    /* error path */ e => { this.message = {"type": "danger", "message": e}; }
                );
        });

        observables
            .subscribe(
                /* happy path */ test => {
                  this.externalObjectRepository.getObjects(this.repos)
                        .subscribe(
                            /* happy path */ externalobjects => {
                                this.externalobjects = externalobjects;
                            },
                            /* error path */ e => { this.message = {"type": "danger", "message": e}; },
                            /* onComplete */ () => {}
                        );
                },
                /* error path */ e => { this.message = {"type": "danger", "message": e}; },
                /* onComplete */ () => { }
            );
    }

    onSelectExternalSystem( externalSystem: any ): void {
        this.externalsystem = externalSystem;

        externalSystem.getSeasons(this.seasons)
            .subscribe(
                /* happy path */ seasons => {
                    this.externalseasons = seasons;
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                /* onComplete */ () => {}
            );
    }

    onAdd(): void {
        this.message = null;
        const modalRef = this.modalService.open(SeasonAddModalContent, { backdrop : 'static' } );

        modalRef.result.then((season) => {
            this.seasons.push( season );
            this.message = { "type": "success", "message": "het seizoen("+season.getName()+") toegevoegd"};
        }, (reason) => {
            this.message = { "type": "danger", "message": reason};
        });
    }

    onEdit( season: Season ): void {
        this.message = null;

        if ( season == null) {
            this.message = { "type": "danger", "message": "het seizoen kan niet gewijzigd worden"};
        }

        const modalRef = this.modalService.open(SeasonEditModalContent, { backdrop : 'static' } );
        modalRef.componentInstance.season = season;
        modalRef.result.then((season) => {
            this.message = { "type": "success", "message": "het seizoen("+season.getName()+") is gewijzigd"};
        }, (reason) => {
            this.message = { "type": "danger", "message": reason};
        });
    }

    onAddExternal( externalseason: Season): void {
        this.message = null;
        const modalRef = this.modalService.open(SeasonAddExternalModalContent, { backdrop : 'static' } );

        modalRef.componentInstance.seasons = this.seasons.filter(
            seasonIt => this.getExternalObject(null, seasonIt ) == null
        );

        modalRef.result.then((season) => {
            this.externalObjectRepository.createObject( this.repos, season, externalseason.getId().toString(), this.externalsystem )
                .subscribe(
                    /* happy path */ externalobject => {
                        this.externalobjects.push(externalobject);
                        this.message = { "type": "success", "message": "extern seizoen "+externalseason.getName()+" gekoppeld aan ("+season.getName()+") toegevoegd"};
                    },
                    /* error path */ e => { this.message = { "type": "success", "message": e}; this.loading = false; },
                    /* onComplete */ () => this.loading = false
                );

        }, (reason) => {
            this.message = { "type": "danger", "message": reason};
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
                    this.message = { "type": "success", "message": "extern seizoen "+externalObject.getExternalid()+" ontkoppeld van "+externalObject.getImportableObject().getName()};
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; this.loading = false; },
                /* onComplete */ () => this.loading = false
            );
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
            let json = { "name": externalseason.getName(), "startdate": externalseason.getStartdate(), "enddate": externalseason.getEnddate() };

            this.repos.createObject( json )
                .subscribe(
                    /* happy path */ season => {
                        this.seasons.push(season);

                        this.externalObjectRepository.createObject( this.repos, season, externalseason.getId().toString(), this.externalsystem )
                            .subscribe(
                                /* happy path */ externalobject => {
                                    this.externalobjects.push(externalobject);
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

    getExternalObjects(importableObject: any): ExternalObject[] {
        return this.externalObjectRepository.getExternalObjects(
            this.externalobjects,
            importableObject);
    }

    getExternalObject(externalid: string, importableObject: any): ExternalObject {
        return this.externalObjectRepository.getExternalObject(
            this.externalobjects,
            this.externalsystem,
            externalid,
            importableObject);
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