/**
 * Created by coen on 10-2-17.
 */

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs/Rx';

import { Competition } from '../../domain/competition';
import { CompetitionRepository } from '../../domain/competition/repository';
import { CompetitionAddModalContent } from './modal/add';
import { CompetitionEditModalContent } from './modal/edit';
import { CompetitionAddExternalModalContent } from './modal/addexternal';
import { ExternalSystem } from '../../domain/external/system';
import { ExternalObject } from '../../domain/external/object';
import { ExternalSystemRepository } from '../../domain/external/system/repository';
import { ExternalObjectRepository } from '../../domain/external/object/repository';

@Component({
    moduleId: module.id,
    selector: 'competitions-external',
    templateUrl: 'external.html'/*,
     styleUrls: [ 'competition.css' ]*/

})

export class CompetitionsExternalComponent implements OnInit{
    @Input()
    competitions: Competition[];
    externalcompetitions: Competition[] = [];
    externalsystem: ExternalSystem;
    externalsystems: ExternalSystem[];
    externalobjects: ExternalObject[];
    loading: boolean = false;
    message: any = null;
    classname: string;

    constructor(
        private repos: CompetitionRepository,
        private route: ActivatedRoute,
        private location: Location,
        private modalService: NgbModal,
        private reposExternalSystem: ExternalSystemRepository,
        private externalObjectRepository: ExternalObjectRepository
        // private globalEventsManger: GlobalEventsManager
    ) {
        this.classname = Competition.classname;
    }

    ngOnInit(): void {

        let observables = Observable.create(observer => {
            this.repos.getObjects()
                .subscribe(
                    /* happy path */ competitions => {
                        this.competitions = competitions;
                        if ( this.competitions != null && this.externalsystems  ){
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
                        if ( this.competitions != null && this.externalsystems  ){
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

        externalSystem.getCompetitions(this.competitions)
            .subscribe(
                /* happy path */ competitions => {
                    this.externalcompetitions = competitions;
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                /* onComplete */ () => {}
            );
    }

    onAdd(): void {
        this.message = null;
        const modalRef = this.modalService.open(CompetitionAddModalContent, { backdrop : 'static' } );

        modalRef.result.then((competition) => {
            this.competitions.push( competition );
            this.message = { "type": "success", "message": "competitie("+competition.getName()+") toegevoegd"};
        }, (reason) => {
            this.message = { "type": "danger", "message": reason};
        });
    }

    onEdit( competition: Competition ): void {
        this.message = null;

        if ( competition == null) {
            this.message = { "type": "danger", "message": "de competitie kan niet gewijzigd worden"};
        }

        const modalRef = this.modalService.open(CompetitionEditModalContent, { backdrop : 'static' } );
        modalRef.componentInstance.competition = competition;
        modalRef.result.then((competition) => {
            this.message = { "type": "success", "message": "competitie("+competition.getName()+") gewijzigd"};
        }, (reason) => {
            this.message = { "type": "danger", "message": reason};
        });
    }

    onAddExternal( externalcompetition: Competition): void {
        this.message = null;
        const modalRef = this.modalService.open(CompetitionAddExternalModalContent, { backdrop : 'static' } );

        modalRef.componentInstance.competitions = this.competitions.filter(
            competitionIt => this.getExternalObject(null, competitionIt ) == null
        );

        modalRef.result.then((competition) => {
            this.externalObjectRepository.createObject( this.repos, competition, externalcompetition.getId().toString(), this.externalsystem )
                .subscribe(
                    /* happy path */ externalobject => {
                        this.externalobjects.push(externalobject);
                        this.message = { "type": "success", "message": "externe competitie "+externalcompetition.getName()+" gekoppeld aan "+competition.getName()};
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
                    this.message = { "type": "success", "message": "externe competitie "+externalObject.getExternalid()+" ontkoppeld van "+externalObject.getImportableObject().getName()};
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; this.loading = false; },
                /* onComplete */ () => this.loading = false
            );
    }

    onImportExternalAll(): void
    {
        for( let externalcompetition of this.externalcompetitions) {
            this.onImportExternal(externalcompetition);
        }
    }

    onImportExternal(externalcompetition): void
    {
        // // check if has internal
        // // if ( false ) { // update internal
        // //     // update
        // // }
        // // else { // add
        //
            let json = { "name": externalcompetition.getName(), "abbreviation" : externalcompetition.getAbbreviation() };

            this.repos.createObject( json )
                .subscribe(
                    /* happy path */ competition => {
                        this.competitions.push(competition);

                        this.externalObjectRepository.createObject( this.repos, competition, externalcompetition.getId().toString(), this.externalsystem )
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

    private getCompetition( externalcompetition: Competition): Competition
    {
        let externalObject = this.getExternalObject(externalcompetition.getId().toString(),null);
        if ( externalObject == null ){
            return null;
        }
        return externalObject.getImportableObject();
    }

    getCompetitionName( externalcompetition: Competition): string
    {
        let internalcompetition = this.getCompetition(externalcompetition);
        if ( internalcompetition == null ){
            return;
        }
        return internalcompetition.getName();
    }
}