/**
 * Created by coen on 22-3-17.
 */

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Rx';

import { CompetitionSeason } from '../../../domain/competitionseason';
import { CompetitionSeasonRepository } from '../../../domain/competitionseason/repository';
import { GameRepository } from '../../../domain/game/repository';
import { ExternalSystem } from '../../../domain/external/system';
import { ExternalObject } from '../../../domain/external/object';
import { ExternalSystemRepository } from '../../../domain/external/system/repository';
// import { TeamRepository } from '../../../domain/team/repository';
import { Game } from '../../../domain/game';
import { RoundRepository } from '../../../domain/round/repository';
import { Round } from '../../../domain/round';
import { StructureService } from '../../../domain/structure/service';
import { ExternalObjectRepository } from '../../../domain/external/object/repository';

@Component({
    moduleId: module.id,
    selector: 'competitionseason-external-planning',
    templateUrl: 'external.html'/*,
     styleUrls: [ 'competitionseason.css' ]*/

})

export class CompetitionSeasonPlanningComponent implements OnInit{
    @Input() competitionseason: CompetitionSeason;
    structureService: StructureService;
    rounds: Round[];
    games: Game[];
    externalrounds: Round[];
    externalgames: Game[];
    // externalsystem: ExternalSystem;
    externalsystems: ExternalSystem[];
    externalobjects: ExternalObject[];
    // externalTeamObjects: ExternalObject[];
    loading: boolean = false;
    message: any = null;
    classname: string;

    constructor(
        private repos: GameRepository,
        private route: ActivatedRoute,
        private reposExternalSystem: ExternalSystemRepository,
        private competitionseasonRepos: CompetitionSeasonRepository,
        private roundRepos: RoundRepository,
        private externalObjectRepository: ExternalObjectRepository
    ) {
        this.classname = Game.classname;
    }

    // do getStructure( competitionseason ) from SoccerSports

    ngOnInit(): void {

        let observables = Observable.create(observer => {
            this.route.params
                .switchMap((params: Params) => this.competitionseasonRepos.getObject(+params['id']))
                .subscribe(competitionseason => {
                        this.competitionseason = competitionseason;
                        console.log(competitionseason);
                        if ( this.competitionseason != null && this.externalsystems != null ){
                            observer.next(true);
                            observer.complete();
                        }

                        this.roundRepos.getObjects( competitionseason )
                            .subscribe(
                                /* happy path */ (rounds: Round[]) => {
                                    this.structureService = new StructureService(competitionseason,rounds);
                                    this.games = this.structureService.getGames();
                                    this.rounds = rounds;
                                },
                                /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                                /* onComplete */ () => {}
                            );
                    },
                    e => { this.message = { "type": "danger", "message": e}; }
                );

            this.reposExternalSystem.getObjects()
                .subscribe(
                    /* happy path */ externalsystems => {
                        this.externalsystems = externalsystems.filter(
                            externalsystem => externalsystem.hasAvailableExportClass( this.classname )
                        );
                        if ( this.competitionseason != null && this.externalsystems != null ){
                            observer.next(true);
                            observer.complete();
                        }
                    },
                    /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                    /* onComplete */ () => {}
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
        //sla hier ook de games op!!!
    }

    // onSelectExternalSystem( externalSystem: any ): void {
    //     this.externalsystem = externalSystem;
    //     this.externalrounds = [];
    //     let externalObject = this.getExternalObject(null, this.competitionseason);
    //     if ( externalObject == null){
    //         this.message = { "type": "danger", "message": "voor dit competitieseizoen is er geen externe variant gevonden"};
    //     }
    //
    //     externalSystem.getCompetitionSeasons()
    //         .subscribe(
    //             /* happy path */ (competitionSeasons: CompetitionSeason[]) => {
    //                 for( let i = 0 ; i < competitionSeasons.length ; i++ ){
    //                     let competitionSeason = competitionSeasons[i];
    //                     if ( competitionSeason.getId().toString() != externalObject.getExternalid() ){
    //                         continue;
    //                     }
    //
    //                     externalSystem.getStructure(competitionSeason)
    //                         .subscribe(
    //                             /* happy path */ rounds => {
    //                                 for( let round of rounds ) {
    //                                     this.externalrounds.push(round);
    //                                 }
    //                             },
    //                             /* error path */ e => { this.message = { "type": "danger", "message": e}; },
    //                             /* onComplete */ () => { console.log('complete'); }
    //                         );
    //                 }
    //             },
    //             /* error path */ e => { this.message = { "type": "danger", "message": e}; },
    //             /* onComplete */ () => {}
    //         );
    //
    //     this.externalObjectRepository.getObjects(this.teamRepos)
    //         .subscribe(
    //             /* happy path */ externalobjects => {
    //                 this.externalTeamObjects = externalobjects;
    //             },
    //             /* error path */ e => { this.message = {"type": "danger", "message": e}; },
    //             /* onComplete */ () => {}
    //         );
    // }
    //
    // onImportExternal(externalrounds): void
    // {
    //     console.log(this.externalTeamObjects);
    //
    //     for( let i = 0 ; i < externalrounds.length ; i++ ) {
    //         let round = externalrounds[i];
    //         let poules = round.getPoules();
    //         for (let j = 0; j < poules.length; j++) {
    //             let poule = poules[j];
    //             let pouleplaces = poule.getPlaces();
    //             for (let k = 0; k < pouleplaces.length; k++) {
    //                 let pouleplace = pouleplaces[k];
    //                 let externalTeamId = pouleplace.getTeam().getId().toString();
    //                 let appTeam = null;
    //
    //                 console.log(pouleplace.getTeam());
    //                 let externalTeamObject = this.externalObjectRepository.getExternalObject(
    //                     this.externalTeamObjects,
    //                     this.externalsystem,
    //                     externalTeamId,
    //                     null);
    //
    //                 if ( externalTeamObject != null ){
    //                     appTeam = externalTeamObject.getImportableObject();
    //                 }
    //
    //                 if (appTeam == null) {
    //                     let message = "het team , voor externid " + externalTeamId + " en het externe systeem " + this.externalsystem.getName() + ", kan niet gevonden worden, importeer eerst het team";
    //                     this.message = { "type": "danger", "message": message};
    //                     return;
    //                 }
    //                 pouleplace.setTeam(appTeam);
    //             }
    //         }
    //         round.setCompetitionSeason(this.competitionseason);
    //     }
    //
    //     let jsonRounds: any[] = this.roundRepos.objectsToJsonHelper(externalrounds);
    //     for( let jsonRound of jsonRounds ) {
    //         this.roundRepos.createObject( jsonRound, this.competitionseason )
    //             .subscribe(
    //                 /* happy path */ round => {
    //                     this.rounds.push( round );
    //                     console.log(this.rounds);
    //                     // reset external teams
    //                     this.onSelectExternalSystem( this.externalsystem );
    //                 },
    //                 /* error path */ e => {
    //                     this.message = { "type": "danger", "message": e};
    //                     this.loading = false;
    //                     this.onSelectExternalSystem( this.externalsystem );
    //                 },
    //                 /* onComplete */ () => this.loading = false
    //             );
    //     }
    // }
    //
    // onRemove(competitionseason): void {
    //     let round: Round;
    //     while(round = this.rounds.pop() ){
    //         console.log(round);
    //         this.roundRepos.removeObject( round )
    //             .subscribe(
    //                 /* happy path */ roundRet => {
    //
    //                 },
    //                 /* error path */ e => {
    //                     this.message = { "type": "danger", "message": e};
    //                     this.loading = false;
    //                 },
    //                 /* onComplete */ () => this.loading = false
    //             );
    //     }
    // }
    //
    // getExternalObject(externalid: string, importableObject: any): ExternalObject {
    //     return this.externalObjectRepository.getExternalObject(
    //         this.externalobjects,
    //         this.externalsystem,
    //         externalid,
    //         importableObject);
    // }
}