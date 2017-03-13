/**
 * Created by coen on 10-2-17.
 */

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { CompetitionSeason } from '../../domain/competitionseason';
import { Association } from '../../domain/association';
import { Competition } from '../../domain/competition';
import { Season } from '../../domain/season';
import { CompetitionSeasonRepository } from '../../domain/competitionseason/repository';
import { AssociationRepository } from '../../domain/association/repository';
import { CompetitionRepository } from '../../domain/competition/repository';
import { SeasonRepository } from '../../domain/season/repository';
import { CompetitionSeasonAddModalContent } from './modal/add';
import { CompetitionSeasonEditModalContent } from './modal/edit';
import { CompetitionSeasonAddExternalModalContent } from './modal/addexternal';
import { ExternalSystem } from '../../domain/external/system';
import { ExternalObject } from '../../domain/external/object';
import { ExternalSystemRepository } from '../../domain/external/system/repository';
import { ExternalObjectRepository } from '../../domain/external/object/repository';

@Component({
    moduleId: module.id,
    selector: 'competitionseasons-external',
    templateUrl: 'external.html'/*,
     styleUrls: [ 'competitionseason.css' ]*/

})

export class CompetitionSeasonsExternalComponent implements OnInit{
    @Input()
    competitionseasons: CompetitionSeason[];
    associations: Association[];
    competitions: Competition[];
    seasons: Season[];

    externalcompetitionseasons: CompetitionSeason[];
    externalsystem: ExternalSystem;
    externalsystems: ExternalSystem[];
    externalobjects: ExternalObject[];
    externalAssociationObjects: ExternalObject[];
    externalCompetitionObjects: ExternalObject[];
    externalSeasonObjects: ExternalObject[];
    loading: boolean = false;
    message: any = null;
    classname: string;

    constructor(
        private repos: CompetitionSeasonRepository,
        private associationRepos: AssociationRepository,
        private competitionRepos: CompetitionRepository,
        private seasonRepos: SeasonRepository,
        private route: ActivatedRoute,
        private location: Location,
        private modalService: NgbModal,
        private reposExternalSystem: ExternalSystemRepository,
        private externalObjectRepository: ExternalObjectRepository
        // private globalEventsManger: GlobalEventsManager
    ) {
        this.classname = CompetitionSeason.classname;
    }

    ngOnInit(): void {

        let observables = Observable.create(observer => {
            this.associationRepos.getObjects()
                .subscribe(
                    /* happy path */ associations => {
                        this.associations = associations;
                        if ( this.seasons != null && this.competitions != null && this.associations != null ){
                            observer.next(true);
                            observer.complete();
                        }
                    },
                    /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                    /* onComplete */ () => {}
                );

            this.competitionRepos.getObjects()
                .subscribe(
                    /* happy path */ competitions => {
                        this.competitions = competitions;
                        if ( this.seasons != null && this.competitions != null && this.associations != null ){
                            observer.next(true);
                            observer.complete();
                        }
                    },
                    /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                    /* onComplete */ () => {}
                );

            this.seasonRepos.getObjects()
                .subscribe(
                    /* happy path */ seasons => {
                        this.seasons = seasons;
                        if ( this.seasons != null && this.competitions != null && this.associations != null ){
                            observer.next(true);
                            observer.complete();
                        }
                    },
                    /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                    /* onComplete */ () => {}
                );
        });

        let observablesExt = Observable.create(observer => {
            observables
                .subscribe(
                    /* happy path */ test => {
                        this.repos.getObjects()
                            .subscribe(
                                /* happy path */ competitionseasons => {
                                    this.competitionseasons = competitionseasons;
                                    if ( this.competitionseasons != null && this.externalsystems != null ){
                                        observer.next(true);
                                        observer.complete();
                                    }
                                },
                                /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                                /* onComplete */ () => {}
                            );
                    },
                    /* error path */ e => { this.message = {"type": "danger", "message": e}; },
                    /* onComplete */ () => { }
                );

            this.reposExternalSystem.getObjects()
                .subscribe(
                    /* happy path */ externalsystems => {
                        this.externalsystems = externalsystems.filter(
                            externalsystem => externalsystem.hasAvailableExportClass( this.classname )
                        );
                        if ( this.competitionseasons != null && this.externalsystems != null ){
                            observer.next(true);
                            observer.complete();
                        }
                    },
                    /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                    /* onComplete */ () => {}
                );
        });

        observablesExt
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
        this.externalcompetitionseasons = [];
        externalSystem.getCompetitionSeasons()
            .subscribe(
                /* happy path */ competitionseasons => {
                    for( let competitionseason of competitionseasons ) {
                        this.externalcompetitionseasons.push(competitionseason);
                    }
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                /* onComplete */ () => { console.log('complete'); }
            );

        this.externalObjectRepository.getObjects(this.associationRepos)
            .subscribe(
                /* happy path */ externalobjects => {
                    this.externalAssociationObjects = externalobjects;
                },
                /* error path */ e => { this.message = {"type": "danger", "message": e}; },
                /* onComplete */ () => {}
            );

        this.externalObjectRepository.getObjects(this.competitionRepos)
            .subscribe(
                /* happy path */ externalobjects => {
                    this.externalCompetitionObjects = externalobjects;
                },
                /* error path */ e => { this.message = {"type": "danger", "message": e}; },
                /* onComplete */ () => {}
            );

        this.externalObjectRepository.getObjects(this.seasonRepos)
            .subscribe(
                /* happy path */ externalobjects => {
                    this.externalSeasonObjects = externalobjects;
                },
                /* error path */ e => { this.message = {"type": "danger", "message": e}; },
                /* onComplete */ () => {}
            );
    }

    onAdd(): void {
        this.message = null;
        const modalRef = this.modalService.open(CompetitionSeasonAddModalContent, { backdrop : 'static' } );

        modalRef.result.then((competitionseason) => {
            this.competitionseasons.push( competitionseason );
            this.message = { "type": "success", "message": "competitieseizoen("+competitionseason.getName()+") toegevoegd"};
        }/*, (reason) => {
         modalRef.closeResult = reason;
         }*/);
    }

    onEdit( competitionseason: CompetitionSeason ): void {
        this.message = null;
        if ( competitionseason == null) {
            this.message = { "type": "danger", "message": "het competitieseizoen kan niet gewijzigd worden"};
        }

        const modalRef = this.modalService.open(CompetitionSeasonEditModalContent, { backdrop : 'static' } );
        modalRef.componentInstance.competitionseason = competitionseason;
        modalRef.result.then((competitionseason) => {
            this.message = { "type": "success", "message": "competitieseizoen("+competitionseason.getName()+") gewijzigd"};
        }/*, (reason) => {
         modalRef.closeResult = reason;
         }*/);
    }

    onAddExternal( externalcompetitionseason: CompetitionSeason): void {
        this.message = null;
        const modalRef = this.modalService.open(CompetitionSeasonAddExternalModalContent, { backdrop : 'static' } );

        modalRef.componentInstance.competitionseasons = this.competitionseasons.filter(
            competitionseasonIt => this.getExternalObject(null, competitionseasonIt ) == null
        );

        modalRef.result.then((competitionseason) => {
            this.externalObjectRepository.createObject( this.repos, competitionseason, externalcompetitionseason.getId().toString(), this.externalsystem )
                .subscribe(
                    /* happy path */ externalobject => {
                        this.externalobjects.push(externalobject);
                        this.message = { "type": "success", "message": "extern competitieseizoen "+externalcompetitionseason.getName()+" gekoppeld aan "+competitionseason.getName()};
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
                    this.message = { "type": "success", "message": "extern competitieseizoen "+externalObject.getExternalid()+" ontkoppeld van "+externalObject.getImportableObject().getName()};
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; this.loading = false; },
                /* onComplete */ () => this.loading = false
            );
    }

    onImportExternalAll(): void
    {
        for( let externalcompetitionseason of this.externalcompetitionseasons) {
            this.importExternalHelper(externalcompetitionseason);
        }
    }

    onImportExternal(externalcompetitionseason): void
    {
        try {
            this.importExternalHelper(externalcompetitionseason);
        }
        catch( e ){
            this.message = { "type": "danger", "message": e};
        }
    }

    importExternalHelper(externalcompetitionseason): void
    {
        // // check if has internal
        // // if ( false ) { // update internal
        // //     // update
        // // }
        // // else { // add
        //

        let externalAssociationId = externalcompetitionseason.getAssociation().getId().toString();
        let foundExternalAssociationObject = this.externalObjectRepository.getExternalObject(
            this.externalAssociationObjects,
            this.externalsystem,
            externalAssociationId,
            null);
        if ( foundExternalAssociationObject == null ){
            throw new Error("de bond, voor externid "+externalAssociationId+" en het externe systeem "+this.externalsystem.getName()+", kan niet gevonden worden, importeer eerst de bonden");
        }

        let externalCompetitionId = externalcompetitionseason.getCompetition().getId().toString();
        let foundExternalCompetitionObject = this.externalObjectRepository.getExternalObject(
            this.externalCompetitionObjects,
            this.externalsystem,
            externalCompetitionId,
            null);
        if ( foundExternalCompetitionObject == null ){
            throw new Error("de bond, voor externid "+externalCompetitionId+" en het externe systeem "+this.externalsystem.getName()+", kan niet gevonden worden, importeer eerst de competities");
        }

        let externalSeasonId = externalcompetitionseason.getSeason().getId().toString();
        let foundExternalSeasonObject = this.externalObjectRepository.getExternalObject(
            this.externalSeasonObjects,
            this.externalsystem,
            externalSeasonId,
            null);
        if ( foundExternalSeasonObject == null ){
            throw new Error("de bond, voor externid "+externalSeasonId+" en het externe systeem "+this.externalsystem.getName()+", kan niet gevonden worden, importeer eerst de seizoen");
        }


        let json = {
            "association": this.associationRepos.objectToJsonHelper( foundExternalAssociationObject.getImportableObject() ),
            "competition": this.competitionRepos.objectToJsonHelper( foundExternalCompetitionObject.getImportableObject() ),
            "season": this.seasonRepos.objectToJsonHelper( foundExternalSeasonObject.getImportableObject() )
        };

        this.repos.createObject( json )
            .subscribe(
                /* happy path */ competitionseason => {
                    this.competitionseasons.push(competitionseason);

                    this.externalObjectRepository.createObject( this.repos, competitionseason, externalcompetitionseason.getId().toString(), this.externalsystem )
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

    private getCompetitionSeason( externalcompetitionseason: CompetitionSeason): CompetitionSeason
    {
        let externalObject = this.getExternalObject(externalcompetitionseason.getId().toString(),null);
        if ( externalObject == null ){
            return null;
        }
        return externalObject.getImportableObject();
    }

    getCompetitionSeasonName( externalcompetitionseason: CompetitionSeason): string
    {
        let internalcompetitionseason = this.getCompetitionSeason(externalcompetitionseason);
        if ( internalcompetitionseason == null ){
            return;
        }
        return internalcompetitionseason.getName();
    }
}