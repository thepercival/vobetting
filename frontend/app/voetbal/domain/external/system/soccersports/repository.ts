/**
 * Created by coen on 17-2-17.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Competition } from '../../../competition';
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

    // this could also be a private method of the component class
    handleError(res: Response): Observable<any> {
        console.error( res );
        // throw an application level error
        return Observable.throw( res.statusText );
    }
}

