/**
 * Created by coen on 26-2-17.
 */

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Team } from '../../domain/team';
import { TeamRepository } from '../../domain/team/repository';
import { TeamAddModalContent } from './modal/add';
import { TeamEditModalContent } from './modal/edit';
import { TeamAddExternalModalContent } from './modal/addexternal';
import { ExternalSystem } from '../../domain/external/system';
import { ExternalObject } from '../../domain/external/object';
import { ExternalSystemRepository } from '../../domain/external/system/repository';
import { ExternalObjectRepository } from '../../domain/external/object/repository';
import {Observable} from 'rxjs/Rx';
import { CompetitionSeason } from '../../domain/competitionseason';
import { AssociationRepository } from '../../domain/association/repository';
import { Association } from '../../domain/association';

@Component({
    moduleId: module.id,
    selector: 'teams-external',
    templateUrl: 'external.html'/*,
     styleUrls: [ 'team.css' ]*/

})

export class TeamsExternalComponent implements OnInit{
    @Input()
    teams: Team[];
    externalcompetitionseasons: CompetitionSeason[];
    externalcompetitionseason: CompetitionSeason;
    associations: Association[];
    externalteams: Team[] = [];
    externalsystem: any;
    externalsystems: ExternalSystem[];
    externalobjects: ExternalObject[];
    externalAssociationObjects: ExternalObject[];
    loading: boolean = false;
    message: any = null;
    classname: string;

    constructor(
        private repos: TeamRepository,
        private route: ActivatedRoute,
        private location: Location,
        private modalService: NgbModal,
        private reposExternalSystem: ExternalSystemRepository,
        private externalObjectRepository: ExternalObjectRepository,
        private associationRepos: AssociationRepository
        // private globalEventsManger: GlobalEventsManager
    ) {
        this.classname = Team.classname;
    }

    ngOnInit(): void {

        let observables = Observable.create(observer => {
            this.repos.getObjects()
                .subscribe(
                    /* happy path */ teams => {
                        this.teams = teams;
                        observer.next(this.teams );
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
                    if ( this.teams != null && this.externalsystems != null && this.externalobjects == null ){
                        this.externalObjectRepository.getObjects(this.repos)
                            .subscribe(
                                /* happy path */ externalobjects => {
                                    this.externalobjects = externalobjects;
                                },
                                /* error path */ e => { this.message = {"type": "danger", "message": e}; },
                                /* onComplete */ () => {}
                            );
                    }
                },
                /* error path */ e => {
                    this.message = {"type": "danger", "message": e};
                },
                /* onComplete */ () => {
                }
            );
    }

    onSelectExternalSystem( externalSystem: any ): void {
        this.externalsystem = externalSystem;
        this.externalcompetitionseasons = [];

        externalSystem.getCompetitionSeasons()
            .subscribe(
                /* happy path */ competitionseasons => {
                    for( let competitionseason of competitionseasons ){
                        this.externalcompetitionseasons.push(competitionseason);
                    }
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                /* onComplete */ () => {}
            );

        this.externalObjectRepository.getObjects(this.associationRepos)
            .subscribe(
                /* happy path */ externalobjects => {
                    this.externalAssociationObjects = externalobjects;
                    console.log(externalobjects);
                },
                /* error path */ e => { this.message = {"type": "danger", "message": e}; },
                /* onComplete */ () => {}
            );


    }

    onSelectCompetitionSeason( competitionseason: CompetitionSeason ): void {
        this.externalcompetitionseason = competitionseason;

        this.externalsystem.getTeams(this.externalcompetitionseason)
            .subscribe(
                /* happy path */ teams => {
                    this.externalteams = teams;
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                /* onComplete */ () => {}
            );
    }

    onAdd(): void {
        this.message = null;
        const modalRef = this.modalService.open(TeamAddModalContent, { backdrop : 'static' } );

        modalRef.result.then((team) => {
            this.teams.push( team );
            this.message = { "type": "success", "message": "team("+team.getName()+") toegevoegd"};
        }/*, (reason) => {
         modalRef.closeResult = reason;
         }*/);
    }

    onEdit( team: Team ): void {
        this.message = null;
        /*let team = this.teams.find( function(item: Team) {
         return ( item.getId() == teamId );
         }, teamId);*/

        if ( team == null) {
            this.message = { "type": "danger", "message": "de team kan niet gewijzigd worden"};
        }

        const modalRef = this.modalService.open(TeamEditModalContent, { backdrop : 'static' } );
        modalRef.componentInstance.team = team;
        modalRef.result.then((team) => {
            this.message = { "type": "success", "message": "team("+team.getName()+") gewijzigd"};
        }, (reason) => {
            this.message = { "type": "danger", "message": reason};
        });
    }

    onAddExternal( externalteam: Team): void {
        this.message = null;
        const modalRef = this.modalService.open(TeamAddExternalModalContent, { backdrop : 'static' } );

        modalRef.componentInstance.teams = this.teams.filter(
            teamIt => this.getExternalObject(null, teamIt ) == null
        );

        modalRef.result.then((team) => {
            this.externalObjectRepository.createObject( this.repos, team, externalteam.getId().toString(), this.externalsystem )
                .subscribe(
                    /* happy path */ externalObject => {
                        this.externalobjects.push(externalObject);
                        this.message = { "type": "success", "message": "extern team "+externalteam.getName()+" gekoppeld aan ("+team.getName()+") toegevoegd"};
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
                    this.message = { "type": "success", "message": "extern team "+externalObject.getExternalid()+" ontkoppeld van "+externalObject.getImportableObject().getName()};
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; this.loading = false; },
                /* onComplete */ () => this.loading = false
            );
    }

    onImportExternalAll(): void
    {
        for( let externalteam of this.externalteams) {
            this.importExternalHelper(externalteam);
        }
    }

    onImportExternal(externalteam): void
    {
        try {
            this.importExternalHelper(externalteam);
        }
        catch( e ){
            this.message = { "type": "danger", "message": e};
        }
    }

    importExternalHelper(externalteam: Team): void
    {
        // // check if has internal
        // // if ( false ) { // update internal
        // //     // update
        // // }
        // // else { // add
        //
        let externalAssociationId = externalteam.getAssociation().getId().toString();
        let foundExternalAssociationObject = this.externalObjectRepository.getExternalObject(
            this.externalAssociationObjects,
            this.externalsystem,
            externalAssociationId,
            null);

        if ( foundExternalAssociationObject == null ){
            throw new Error("de bond, voor externid "+externalAssociationId+" en het externe systeem "+this.externalsystem.getName()+", kan niet gevonden worden, importeer eerst de bonden");
        }

        let json = { "name": externalteam.getName(),
            "abbreviation" : externalteam.getAbbreviation(),
            "association": this.associationRepos.objectToJsonHelper( foundExternalAssociationObject.getImportableObject() ) };

        this.repos.createObject( json )
            .subscribe(
                /* happy path */ team => {
                    this.teams.push(team);

                    this.externalObjectRepository.createObject( this.repos, team, externalteam.getId().toString(), this.externalsystem )
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

    private getTeam( externalteam: Team): Team
    {
        let externalObject = this.getExternalObject(externalteam.getId().toString(), null);
        if ( externalObject == null ){
            return null;
        }
        return externalObject.getImportableObject();
    }

    getTeamName( externalteam: Team): string
    {
        let internalteam = this.getTeam(externalteam);

        if ( internalteam == null ){
            return;
        }
        return internalteam.getName();
    }
}
