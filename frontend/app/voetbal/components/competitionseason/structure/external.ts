/**
 * Created by coen on 27-2-17.
 */

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/map';

import { CompetitionSeason } from '../../../domain/competitionseason';
import { CompetitionSeasonRepository } from '../../../domain/competitionseason/repository';
import { ExternalSystem } from '../../../domain/external/system';
import { ExternalObject } from '../../../domain/external/object';
import { ExternalSystemRepository } from '../../../domain/external/system/repository';
import { TeamRepository } from '../../../domain/team/repository';
import { Round } from '../../../domain/competitionseason/round';
import { RoundRepository } from '../../../domain/competitionseason/round/repository';
import { Team } from '../../../domain/team';

@Component({
    moduleId: module.id,
    selector: 'competitionseason-external-structure',
    templateUrl: 'external.html'/*,
     styleUrls: [ 'competitionseason.css' ]*/

})

export class CompetitionSeasonStructureComponent implements OnInit{
    @Input() competitionseason: CompetitionSeason;
    externalrounds: Round[];
    externalsystem: ExternalSystem;
    externalsystems: ExternalSystem[];
    loading: boolean = false;
    message: any = null;
    classname: string;

    constructor(
        private repos: CompetitionSeasonRepository,
        private route: ActivatedRoute,
        private reposExternalSystem: ExternalSystemRepository,
        private teamRepos: TeamRepository,
        private roundRepos: RoundRepository
    ) {
        this.classname = Round.classname;
    }

    // do getStructure( competitionseason ) from SoccerSports

    ngOnInit(): void {

        this.route.params
            .switchMap((params: Params) => this.repos.getObject(+params['id']))
            .subscribe(competitionseason => {
                    this.competitionseason = competitionseason
                },
                    e => { this.message = { "type": "danger", "message": e}; }
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
        this.externalrounds = [];

        let externalObject: ExternalObject = this.competitionseason.getExternal(null,externalSystem);
        if ( externalObject == null){
            this.message = { "type": "danger", "message": "voor deze competitie is er geen externe variant gevonden"};
        }

        externalSystem.getCompetitionSeasons()
            .subscribe(
                /* happy path */ (competitionSeasons: CompetitionSeason[]) => {
                    for( let i = 0 ; i < competitionSeasons.length ; i++ ){
                        let competitionSeason = competitionSeasons[i];
                        if ( competitionSeason.getId().toString() != externalObject.getExternalid() ){
                            continue;
                        }

                        externalSystem.getStructure(competitionSeason)
                            .subscribe(
                                /* happy path */ rounds => {
                                    for( let round of rounds ) {
                                        this.externalrounds.push(round);
                                    }
                                },
                                /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                                /* onComplete */ () => { console.log('complete'); }
                            );
                    }
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                /* onComplete */ () => {}
            );
    }

    onImportExternal(externalrounds): void
    {


        // this.competitionseason

        // replace externalteams with teams
        let teamsObservable = this.teamRepos.getObjects();
        teamsObservable.forEach( (teams ) => {

            for( let i = 0 ; i < externalrounds.length ; i++ ) {
                let round = externalrounds[i];
                let poules = round.getPoules();
                for (let j = 0; j < poules.length; j++) {
                    let poule = poules[j];
                    let pouleplaces = poule.getPlaces();
                    for (let k = 0; k < pouleplaces.length; k++) {
                        let pouleplace = pouleplaces[k];
                        let externalTeamId = pouleplace.getTeam().getId().toString();
                        let appTeam = teams.filter(
                            team => team.hasExternalid(externalTeamId, this.externalsystem)
                        ).shift();
                        if (appTeam == null) {
                            let message = "het team , voor externid " + externalTeamId + " en het externe systeem " + this.externalsystem.getName() + ", kan niet gevonden worden, importeer eerst het team";
                            this.message = { "type": "danger", "message": message};
                            return;
                        }
                        pouleplace.setTeam(appTeam);
                    }
                }
            }

            console.log('converted teams');

            console.log('convert structure to json');
            let json = this.roundRepos.objectsToJsonHelper(externalrounds);
            console.log(json);
            // call repos ->add structure
            console.log('add structure to cs');
        } );



        //
        // let json = {
        //     "associationid": appAssociation.getId(),
        //     "competitionid": appCompetition.getId(),
        //     "seasonid": appSeason.getId()
        // };
        //
        // this.repos.createObject( json )
        //     .subscribe(
        //         /* happy path */ competitionseason => {
        //             this.competitionseasons.push(competitionseason);
        //
        //             this.externalObjectRepository.createObject( this.repos.getUrlpostfix(), competitionseason, externalcompetitionseason.getId().toString(), this.externalsystem )
        //                 .subscribe(
        //                     /* happy path */ externalobject => {
        //                         this.onAddExternalHelper( competitionseason, externalobject, externalcompetitionseason );
        //                     },
        //                     /* error path */ e => { this.message = { "type": "danger", "message": e}; this.loading = false; },
        //                     /* onComplete */ () => this.loading = false
        //                 );
        //
        //         },
        //         /* error path */ e => { this.message = { "type": "danger", "message": e}; this.loading = false; },
        //         /* onComplete */ () => this.loading = false
        //     );
        // // }


    }


}