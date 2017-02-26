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

@Component({
    moduleId: module.id,
    selector: 'teams-external',
    templateUrl: 'external.html'/*,
     styleUrls: [ 'team.css' ]*/

})

export class TeamsExternalComponent implements OnInit{
    @Input()
    teams: Team[];
    externalteams: Team[] = [];
    externalsystem: ExternalSystem;
    externalsystems: ExternalSystem[];
    loading: boolean = false;
    message: any = null;
    classname: string;

    constructor(
        private repos: TeamRepository,
        private route: ActivatedRoute,
        private location: Location,
        private modalService: NgbModal,
        private reposExternalSystem: ExternalSystemRepository,
        private externalObjectRepository: ExternalObjectRepository
        // private globalEventsManger: GlobalEventsManager
    ) {
        this.classname = Team.classname;
    }

    ngOnInit(): void {

        this.repos.getObjects()
            .subscribe(
                /* happy path */ teams => {
                    this.teams = teams;
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

        externalSystem.getTeams(this.teams)
            .subscribe(
                /* happy path */ teams => {
                    this.externalteams = teams;
                    this.selectExternalSystemHelper(teams, this.teams);
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
                externalObject.addExternals(this.externalObjectRepository.jsonToArrayHelper([jsonExternal],externalObject));
            }
        }
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
        }/*, (reason) => {
         modalRef.closeResult = reason;
         }*/);
    }

    onAddExternal( externalteam: Team): void {
        this.message = null;
        const modalRef = this.modalService.open(TeamAddExternalModalContent, { backdrop : 'static' } );

        modalRef.componentInstance.teams = this.teams.filter(
            team => !team.hasExternalid( externalteam.getId().toString(), this.externalsystem )
        );

        modalRef.result.then((team) => {
            this.externalObjectRepository.createObject( this.repos.getUrlpostfix(), team, externalteam.getId().toString(), this.externalsystem )
                .subscribe(
                    /* happy path */ externalobject => {
                        this.onAddExternalHelper( team, externalobject, externalteam );
                        this.message = { "type": "success", "message": "externe team "+externalteam.getName()+" gekoppeld aan ("+team.getName()+") toegevoegd"};
                    },
                    /* error path */ e => { this.message = { "type": "success", "message": e}; this.loading = false; },
                    /* onComplete */ () => this.loading = false
                );

        }/*, (reason) => {
         modalRef.closeResult = reason;
         }*/);
    }

    onAddExternalHelper( team: Team, externalobject: ExternalObject, externalteam: Team ): void {
        // @todo following code should move to service
        // add to internal
        team.getExternals().push(externalobject);
        // add to external
        let jsonExternal = { "externalid" : team.getId(), "externalsystem": null };
        externalteam.addExternals(this.externalObjectRepository.jsonToArrayHelper([jsonExternal],externalteam));
    }

    onRemove( externalObject: ExternalObject ): void
    {
        // @todo following code should move to service
        // remove from internal
        let internalteam = this.getTeam( externalObject.getImportableObject() );
        if ( internalteam == null ) {
            this.message = { "type": "danger", "message": "interne team niet gevonden"};
            return;
        }

        let internalexternal = internalteam.getExternal(externalObject.getImportableObject().getId(), this.externalsystem);

        this.externalObjectRepository.removeObject( this.repos.getUrlpostfix(), internalexternal )
            .subscribe(
                /* happy path */ retval => {

                    let indextmp = internalteam.getExternals().indexOf(internalexternal);
                    if (indextmp > -1) {
                        internalteam.getExternals().splice(indextmp, 1);
                    }

                    // remove from external
                    let externals = externalObject.getImportableObject().getExternals();
                    let index = externals.indexOf(externalObject);
                    if (index > -1) {
                        externals.splice(index, 1);
                    }

                    this.message = { "type": "success", "message": "externe team "+externalObject.getImportableObject().getName()+" ontkoppeld van ("+internalteam.getName()+") toegevoegd"};
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; this.loading = false; },
                /* onComplete */ () => this.loading = false
            );
    }

    onImportExternalAll(): void
    {
        for( let externalteam of this.externalteams) {
            this.onImportExternal(externalteam);
        }
    }

    onImportExternal(externalteam): void
    {
        // check if has internal
        // if ( false ) { // update internal
        //     // update
        // }
        // else { // add

        let json = { "name": externalteam.getName(), "abbreviation" : externalteam.getAbbreviation() };

        this.repos.createObject( json )
            .subscribe(
                /* happy path */ team => {
                    this.teams.push(team);

                    this.externalObjectRepository.createObject( this.repos.getUrlpostfix(), team, externalteam.getId().toString(), this.externalsystem )
                        .subscribe(
                            /* happy path */ externalobject => {
                                this.onAddExternalHelper( team, externalobject, externalteam );
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

    private getTeam( externalteam: Team): Team
    {
        let externals = externalteam.getExternals();
        if ( externals.length != 1 ){
            return;
        }

        let externalid = externals[0].getExternalid();

        let foundTeams = this.teams.filter(
            team => team.getId().toString() == externalid
        );
        if ( foundTeams.length != 1 ){
            return;
        }
        return foundTeams[0];
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
