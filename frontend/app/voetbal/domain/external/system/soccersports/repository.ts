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
import { ExternalObjectRepository } from '../../object/repository';
import { ExternalSystemSoccerSports } from '../soccersports';
import { ExternalSystemRepository } from '../repository';

@Injectable()
export class ExternalSystemSoccerSportsRepository{

    private headers = new Headers({'Content-Type': 'application/json'});
    private http: Http;
    private externalObjectRepository: ExternalObjectRepository;
    private externalSystem: ExternalSystemSoccerSports;

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

    getAssociations( appAssociations: Association[] ): Observable<Association[]>
    {
        let url = this.externalSystem.getApiurl() + 'leagues';
        return this.http.get(url, new RequestOptions({ headers: this.getHeaders() }) )
            .map((res) => {
                let json = res.json().data;
                if ( json.errorCode != 0 ) {
                    this.handleError(res);
                }
                return this.jsonAssociationsToArrayHelper(json.leagues, appAssociations )
            })
            .catch( this.handleError );
    }

    jsonAssociationsToArrayHelper( jsonArray : any, appAssociations: Association[] ): Association[]
    {
        let associations: Association[] = [];
        for (let json of jsonArray) {
            let object = this.jsonAssociationToObjectHelper(json,appAssociations);
            let foundObjects = associations.filter( assFilter => assFilter.getId() == object.getId() );
            if ( foundObjects.length > 0 ){
                continue;
            }
            associations.push( object );
        }
        return associations;
    }

    jsonAssociationToObjectHelper( json : any, appAssociations: Association[] ): Association
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

        let foundAppAssociations = appAssociations.filter( assFilter => assFilter.hasExternalid( association.getId().toString(), this.externalSystem ) );
        let foundAppAssociation = foundAppAssociations.shift();
        if ( foundAppAssociation ){
            let jsonExternal = { "externalid" : foundAppAssociation.getId(), "externalsystem": null };
            association.addExternals(this.externalObjectRepository.jsonToArrayHelper([jsonExternal],association));
        }
        return association;
    }

    getCompetitions( appCompetitions: Competition[] ): Observable<Competition[]>
    {
        let url = this.externalSystem.getApiurl() + 'leagues';
        return this.http.get(url, new RequestOptions({ headers: this.getHeaders() }) )
            .map((res) => {
                let json = res.json().data;
                if ( json.errorCode != 0 ) {
                    this.handleError(res);
                }
                return this.jsonCompetitionsToArrayHelper(json.leagues, appCompetitions )
            })
            .catch( this.handleError );
    }

    jsonCompetitionsToArrayHelper( jsonArray : any, appCompetitions: Competition[] ): Competition[]
    {
        let competitions: Competition[] = [];
        for (let json of jsonArray) {
            let object = this.jsonCompetitionToObjectHelper(json,appCompetitions);
            competitions.push( object );
        }
        return competitions;
    }

    jsonCompetitionToObjectHelper( json : any, appCompetitions: Competition[] ): Competition
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

        let foundAppCompetitions = appCompetitions.filter( compFilter => compFilter.hasExternalid( competition.getId().toString(), this.externalSystem ) );
        let foundAppCompetition = foundAppCompetitions.shift();
        if ( foundAppCompetition ){
            let jsonExternal = { "externalid" : foundAppCompetition.getId(), "externalsystem": null };
            competition.addExternals(this.externalObjectRepository.jsonToArrayHelper([jsonExternal],competition));
        }
        return competition;
    }

    getSeasons( appSeasons: Season[] ): Observable<Season[]>
    {
        let url = this.externalSystem.getApiurl() + 'leagues' + '/premier-league/seasons';
        return this.http.get(url, new RequestOptions({ headers: this.getHeaders() }) )
            .map((res) => {
                let json = res.json().data;
                if ( json.errorCode != 0 ) {
                    this.handleError(res);
                }
                return this.jsonSeasonsToArrayHelper(json.seasons, appSeasons )
            })
            .catch( this.handleError );
    }

    jsonSeasonsToArrayHelper( jsonArray : any, appSeasons: Season[] ): Season[]
    {
        let seasons: Season[] = [];
        for (let json of jsonArray) {
            let object = this.jsonSeasonToObjectHelper(json,appSeasons);
            let foundObjects = seasons.filter( assFilter => assFilter.getId() == object.getId() );
            if ( foundObjects.length > 0 ){
                continue;
            }
            seasons.push( object );
        }
        return seasons;
    }

    jsonSeasonToObjectHelper( json : any, appSeasons: Season[] ): Season
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

        let foundAppSeasons = appSeasons.filter( seasonFilter => seasonFilter.hasExternalid( season.getId().toString(), this.externalSystem ) );
        let foundAppSeason = foundAppSeasons.shift();
        if ( foundAppSeason ){
            let jsonExternal = { "externalid" : foundAppSeason.getId(), "externalsystem": null };
            season.addExternals(this.externalObjectRepository.jsonToArrayHelper([jsonExternal],season));
        }
        return season;
    }

    getCompetitionSeasons( appCompetitionSeasons: CompetitionSeason[] ): Observable<CompetitionSeason[]>
    {
        let appCompetitions: Competition[] = [];
        for( let appCompetitionSeason of appCompetitionSeasons){
            let foundCompetitions = appCompetitions.filter( compFilter => compFilter.getId() == appCompetitionSeason.getCompetition().getId() );
            if ( foundCompetitions.length == 0 ) {
                appCompetitions.push( appCompetitionSeason.getCompetition() );
            }
        }

        let competitionseasons: CompetitionSeason[] = [];
        {
            let competitionsObservable: Observable<Competition[]> = this.getCompetitions(appCompetitions);


            competitionsObservable.forEach(externalcompetitions => {
                let externalcompetition = externalcompetitions[0];

                //for( let observableCompetitionSeasonsIt of observableCompetitionSeasons ) {
                    //observableCompetitionSeasonsIt.forEach( competitionseasonsIt => {
                        // competitionseasons.add( competitionseasons )
                       // console.log(competitionseasonsIt);
                   // } );
               // }

                //if ( externalcompetition.getId().toString() == 'premier-league') {
                let observableCompetitionSeasonsTmp = this.getCompetitionSeasonsHelper(externalcompetition, appCompetitionSeasons);
                observableCompetitionSeasonsTmp.forEach( competitionseasonsIt => {
                    for ( let competitionseasonIt of competitionseasonsIt ){
                        competitionseasons.push( competitionseasonIt );
                    }
                } );
            });
        }

        return Observable.create(observer => {
            observer.next(competitionseasons);
            observer.complete();
        });
    }

    getCompetitionSeasonsHelper( externalcompetition: Competition, appCompetitionSeasons: CompetitionSeason[] ): Observable<CompetitionSeason[]>
    {
        let url = this.externalSystem.getApiurl() + 'leagues/'+externalcompetition.getId()+'/seasons';
        return this.http.get(url, new RequestOptions({ headers: this.getHeaders() }) )
            .map((res: Response) => {
                let json = res.json().data;
                if ( json.errorCode != 0 ) {
                    this.handleError(res);
                }
                return this.jsonCompetitionSeasonsToArrayHelper(json.seasons, externalcompetition, appCompetitionSeasons )
            })
            .catch( this.handleError );
    }

    jsonCompetitionSeasonsToArrayHelper( jsonArray : any, externalcompetition: Competition, appCompetitionSeasons: CompetitionSeason[] ): CompetitionSeason[]
    {
        let competitionseasons: CompetitionSeason[] = [];
        for (let json of jsonArray) {
            let object = this.jsonCompetitionSeasonToObjectHelper(json, externalcompetition, appCompetitionSeasons);
            competitionseasons.push( object );
        }
        return competitionseasons;
    }

    jsonCompetitionSeasonToObjectHelper( json : any, externalcompetition: Competition, appCompetitionSeasons: CompetitionSeason[] ): CompetitionSeason
    {
        // "identifier": "ef5f67b10885e37c43bccb02c70b6e1d",
        // "league_identifier": "726a53a8c50d6c7a66fe0ab16bdf9bb1",
        // "season_slug": "15-16",
        // "name": "2015-2016",
        // "season_start": "2015-07-01T00:00:00+0200",
        // "season_end": "2016-06-30T00:00:00+0200"

        // let foundCompetitionSeasons = appCompetitionSeasons.filter( compSeasonFilter => compSeasonFilter.getCompetition().getId() == externalcompetition.getId() );
        // let competition = if ( foundCompetitionSeasons.length == 0 ) {
                // appCompetitions.push( appCompetitionSeason.getCompetition() );
           //  }
        // }

        let appSeasons: Season[] = [];
        let season: Season = this.jsonSeasonToObjectHelper( json, appSeasons );

        let association = new Association('asdasd');
        let competitionseason = new CompetitionSeason(association, externalcompetition,season);

        // //competitionseason.setId(json.league_slug);
        // //competitionseason.setAbbreviation(competition.getName().substr(0,Competition.MAX_LENGTH_ABBREVIATION));
        //
        // let foundAppCompetitionSeasons = appCompetitionSeasons.filter( compseasonFilter => compseasonFilter.hasExternalid( competitionseason.getId().toString(), this.externalSystem ) );
        // let foundAppCompetitionSeason = foundAppCompetitionSeasons.shift();
        // if ( foundAppCompetitionSeason ){
        //     let jsonExternal = { "externalid" : foundAppCompetitionSeason.getId(), "externalsystem": null };
        //     competitionseason.addExternals(this.externalObjectRepository.jsonToArrayHelper([jsonExternal],competitionseason));
        // }
        return competitionseason;
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

