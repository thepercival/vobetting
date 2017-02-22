/**
 * Created by coen on 17-2-17.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Competition } from '../../../competition';
import { Association } from '../../../association';
import { Season } from '../../../season';
import { ExternalObjectRepository } from '../../object/repository';
import { ExternalSystemSoccerSports } from '../soccersports';
import { ExternalSystemRepository } from '../repository';

@Injectable()
export class ExternalSystemSoccerSportsRepository{

    private headers = new Headers({'Content-Type': 'application/json'});
    private http: Http;
    private externalObjectRepository: ExternalObjectRepository;
    private externalSystem: ExternalSystemSoccerSports;

    constructor( http: Http, externalSystem: ExternalSystemSoccerSports )
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

    // this could also be a private method of the component class
    handleError(error: any): Observable<any> {
        let message = null;
        if ( error.message != null){
            message = error.message;
        }
        else if ( error.statusText != null){
            message = error.statusText;
        }
        // throw an application level error
        return Observable.throw( message );
    }
}

