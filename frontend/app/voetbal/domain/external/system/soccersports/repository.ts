/**
 * Created by coen on 17-2-17.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Association } from '../../../association';
import { Competition } from '../../../competition';
import { Season } from '../../../season';
import { CompetitionSeason } from '../../../competitionseason';
import { Team } from '../../../team';
import { Round } from '../../../competitionseason/round';
import { Poule } from '../../../competitionseason/poule';
import { PoulePlace } from '../../../competitionseason/pouleplace';
import { ExternalObjectRepository } from '../../object/repository';
import { ExternalSystemSoccerSports } from '../soccersports';
import { ExternalSystemRepository } from '../repository';

@Injectable()
export class ExternalSystemSoccerSportsRepository{

    private headers = new Headers({'Content-Type': 'application/json'});
    private http: Http;
    private externalObjectRepository: ExternalObjectRepository;
    private externalSystem: ExternalSystemSoccerSports;
    private asspociationsByCompetitionId: any = {};

    constructor( http: Http,externalSystem: ExternalSystemSoccerSports )
    {
        this.http = http;
        this.externalSystem = externalSystem;
        let externalSystemRepository = new ExternalSystemRepository(http);
        this.externalObjectRepository = new ExternalObjectRepository(http, externalSystemRepository );
    }

    getToken(): string
    {
        return this.externalSystem.getApikey();
    }

    getHeaders(): Headers
    {
        let headers = new Headers(this.headers);
        if ( this.getToken() != null ) {
            headers.append( 'X-Mashape-Key', this.getToken() );
        }
        return headers;
    }

    getAssociations(): Observable<Association[]>
    {
        let url = this.externalSystem.getApiurl() + 'leagues';
        return this.http.get(url, new RequestOptions({ headers: this.getHeaders() }) )
            .map((res) => {
                let json = res.json().data;
                if ( json.errorCode != 0 ) {
                    this.handleError(res);
                }
                return this.jsonAssociationsToArrayHelper(json.leagues )
            })
            .catch( this.handleError );
    }

    jsonAssociationsToArrayHelper( jsonArray : any): Association[]
    {
        let associations: Association[] = [];
        for (let json of jsonArray) {
            let object = this.jsonAssociationToObjectHelper(json);
            let foundObjects = associations.filter( assFilter => assFilter.getId() == object.getId() );
            if ( foundObjects.length > 0 ){
                continue;
            }
            associations.push( object );
        }
        return associations;
    }

    jsonAssociationToObjectHelper( json : any): Association
    {
        // identifier: "8e7fa444c4b60383727fb61fcc6aa387",
        // league_slug: "bundesliga",
        // name: "Bundesliga",
        // nation: "Germany",
        // level: "1"
        // cup: false,
        // federation: "UEFA"

        let association = new Association(json.federation);
        association.setId(json.federation);
        return association;
    }

    getCompetitions(): Observable<Competition[]>
    {
        let url = this.externalSystem.getApiurl() + 'leagues';
        return this.http.get(url, new RequestOptions({ headers: this.getHeaders() }) )
            .map((res) => {
                let json = res.json().data;
                if ( json.errorCode != 0 ) {
                    this.handleError(res);
                }
                return this.jsonCompetitionsToArrayHelper(json.leagues )
            })
            .catch( this.handleError );
    }

    jsonCompetitionsToArrayHelper( jsonArray : any ): Competition[]
    {
        let competitions: Competition[] = [];
        for (let json of jsonArray) {
            let object = this.jsonCompetitionToObjectHelper(json);
            competitions.push( object );
        }
        return competitions;
    }

    jsonCompetitionToObjectHelper( json : any ): Competition
    {
        // identifier: "8e7fa444c4b60383727fb61fcc6aa387",
        // league_slug: "bundesliga",
        // name: "Bundesliga",
        // nation: "Germany",
        // level: "1"
        // cup: false,
        // federation: "UEFA"

        let competition = new Competition(json.name);
        competition.setId(json.league_slug);
        competition.setAbbreviation(competition.getName().substr(0,Competition.MAX_LENGTH_ABBREVIATION));
        this.setAsspociationByCompetitionId( competition.getId(), this.jsonAssociationToObjectHelper(json));

        return competition;
    }

    getSeasons(): Observable<Season[]>
    {
        let url = this.externalSystem.getApiurl() + 'leagues' + '/premier-league/seasons';
        return this.http.get(url, new RequestOptions({ headers: this.getHeaders() }) )
            .map((res) => {
                let json = res.json().data;
                if ( json.errorCode != 0 ) {
                    this.handleError(res);
                }
                return this.jsonSeasonsToArrayHelper(json.seasons )
            })
            .catch( this.handleError );
    }

    jsonSeasonsToArrayHelper( jsonArray : any ): Season[]
    {
        let seasons: Season[] = [];
        for (let json of jsonArray) {
            let object = this.jsonSeasonToObjectHelper(json);
            let foundObjects = seasons.filter( assFilter => assFilter.getId() == object.getId() );
            if ( foundObjects.length > 0 ){
                continue;
            }
            seasons.push( object );
        }
        return seasons;
    }

    jsonSeasonToObjectHelper( json : any ): Season
    {
        // "identifier": "ef5f67b10885e37c43bccb02c70b6e1d",
        // "league_identifier": "726a53a8c50d6c7a66fe0ab16bdf9bb1",
        // "season_slug": "15-16",
        // "name": "2015-2016",
        // "season_start": "2015-07-01T00:00:00+0200",
        // "season_end": "2016-06-30T00:00:00+0200"

        let season = new Season(json.name);
        season.setId(json.season_slug);
        let startDate = new Date(json.season_start);
        if ( startDate == null){
            throw new Error("het geimporteerde seizoen heeft geen startdatum");
        }
        season.setStartdate(startDate);
        let endDate = new Date(json.season_end);
        if ( endDate == null){
            throw new Error("het geimporteerde seizoen heeft geen einddatum");
        }
        season.setEnddate(endDate);

        // let foundAppSeasons = appSeasons.filter( seasonFilter => seasonFilter.hasExternalid( season.getId().toString(), this.externalSystem ) );
        // let foundAppSeason = foundAppSeasons.shift();
        // if ( foundAppSeason ){
        //     let jsonExternal = { "externalid" : foundAppSeason.getId(), "externalsystem": null };
        //     season.addExternals(this.externalObjectRepository.jsonToArrayHelper([jsonExternal],season));
        // }
        return season;
    }

    getCompetitionSeasons(): Observable<CompetitionSeason[]>
    {
        return Observable.create(observer => {

            let competitionsObservable: Observable<Competition[]> = this.getCompetitions();

            competitionsObservable.forEach(externalcompetitions => {
                for (let externalcompetition of externalcompetitions) {

                    if (externalcompetition.getId().toString() != 'premier-league' && externalcompetition.getId().toString() != 'eredivisie') {
                        continue;
                    }

                    let observableCompetitionSeasonsTmp = this.getCompetitionSeasonsHelper(externalcompetition);
                    observableCompetitionSeasonsTmp.forEach(competitionseasonsIt => {
                        observer.next(competitionseasonsIt);
                    });
                }
            });

            setTimeout(() => {
                observer.complete();
            }, 5000);

        });
    }

    getCompetitionSeasonsHelper( externalcompetition: Competition ): Observable<CompetitionSeason[]>
    {
        let url = this.externalSystem.getApiurl() + 'leagues/'+externalcompetition.getId()+'/seasons';
        return this.http.get(url, new RequestOptions({ headers: this.getHeaders() }) )
            .map((res: Response) => {
                let json = res.json().data;
                if ( json.errorCode != 0 ) {
                    this.handleError(res);
                }
                return this.jsonCompetitionSeasonsToArrayHelper(json.seasons, externalcompetition )
            })
            .catch( this.handleError );
    }

    jsonCompetitionSeasonsToArrayHelper( jsonArray : any, externalcompetition: Competition ): CompetitionSeason[]
    {
        let competitionseasons: CompetitionSeason[] = [];
        for (let json of jsonArray) {
            let object = this.jsonCompetitionSeasonToObjectHelper(json, externalcompetition);
            competitionseasons.push( object );
        }
        return competitionseasons;
    }

    jsonCompetitionSeasonToObjectHelper( json : any, competition: Competition ): CompetitionSeason
    {
        // "identifier": "ef5f67b10885e37c43bccb02c70b6e1d",
        // "league_identifier": "726a53a8c50d6c7a66fe0ab16bdf9bb1",
        // "season_slug": "15-16",
        // "name": "2015-2016",
        // "season_start": "2015-07-01T00:00:00+0200",
        // "season_end": "2016-06-30T00:00:00+0200"

        let season: Season = this.jsonSeasonToObjectHelper( json );
        let association = this.getAsspociationByCompetitionId( competition.getId());
        // console.log(association);
        let competitionseason = new CompetitionSeason(association, competition, season);
        competitionseason.setId( association.getId().toString() + '_' + competition.getId().toString() + '_' + season.getId().toString() );

        return competitionseason;
    }

    getTeams( competitionSeason: CompetitionSeason ): Observable<Team[]>
    {
        let url = this.externalSystem.getApiurl() + 'leagues' + '/' + competitionSeason.getCompetition().getId() + '/seasons/' + competitionSeason.getSeason().getId() + '/teams';

        return this.http.get(url, new RequestOptions({ headers: this.getHeaders() }) )
            .map((res) => {
                let json = res.json().data;
                if ( json.errorCode != 0 ) {
                    this.handleError(res);
                }
                return this.jsonTeamsToArrayHelper(json.teams, competitionSeason.getCompetition() );
            })
            .catch( this.handleError );
    }

    jsonTeamsToArrayHelper( jsonArray : any, competition: Competition ): Team[]
    {
        let objects: Team[] = [];
        for (let json of jsonArray) {
            let object = this.jsonTeamToObjectHelper(json, competition);
            let foundObjects = objects.filter( objFilter => objFilter.getId() == object.getId() );
            if ( foundObjects.length > 0 ){
                continue;
            }
            objects.push( object );
        }
        return objects;
    }

    jsonTeamToObjectHelper( json : any, competition: Competition ): Team
    {
        // "identifier": "r4xhp8c6tpedhrd9v14valjgye847oa5",
        // "team_slug": "ado",
        // "name": "ADO",
        // "flag": "",
        // "notes": ""

        let team = new Team(json.name);
        team.setId(json.team_slug);
        team.setAssociation( this.getAsspociationByCompetitionId( competition.getId() ) );
        return team;
    }

    getStructure( competitionSeason: CompetitionSeason ): Observable<Round[]>
    {
        return Observable.create(observer => {

            let rounds: Round[] = [];
            let firstroundNumber: number = 1;
            let round = new Round(competitionSeason, firstroundNumber);
            {
                round.setId(firstroundNumber);

                let firstpouleNumber: number = 1;
                let poule = new Poule(round, firstpouleNumber);
                {
                    poule.setId(firstpouleNumber);
                    let pouleplaces = poule.getPlaces();

                    this.getTeams(competitionSeason)
                        .subscribe(
                            /* happy path */ teams => {
                                let counter = 0;
                                for( let team of teams){
                                    let pouleplace = new PoulePlace(poule, ++counter);
                                    pouleplace.setId(counter);
                                    pouleplace.setTeam(team);
                                    pouleplaces.push(pouleplace);
                                }
                            },
                            /* error path */ e => {},
                            /* onComplete */ () => {}
                        );

                    round.getPoules().push(poule);
                }

                rounds.push(round);
            }

            observer.next(rounds);
            observer.complete();
        });
    }

    getAsspociationByCompetitionId( competitionId ){
        return this.asspociationsByCompetitionId[competitionId];
    }
    setAsspociationByCompetitionId( competitionId, association){
        this.asspociationsByCompetitionId[competitionId] = association;
    }


    // this could also be a private method of the component class
    handleError(error: any): Observable<any> {
        console.log( error );
        let message = null;
        if ( error && error.message != null){
            message = error.message;
        }
        else if ( error &&  error.statusText != null){
            message = error.statusText;
        }
        // throw an application level error
        return Observable.throw( message );
    }
}

