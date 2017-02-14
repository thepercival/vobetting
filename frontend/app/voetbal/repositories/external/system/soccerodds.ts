/**
 * Created by coen on 30-1-17.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Competition } from '../../../domain/competition';
import { ExternalObjectRepository } from '../object';
import { ExternalSystemSoccerOdds } from '../../../domain/external/system/soccerodds';
import { ExternalSystemRepository } from '../system';

@Injectable()
export class ExternalSystemSoccerOddsRepository{

    private headers = new Headers({'Content-Type': 'application/json'});
    private url : string = "https://arisalexis-soccer-odds-v1.p.mashape.com";
    private http: Http;
    private externalObjectRepository: ExternalObjectRepository;
    private externalSystem: ExternalSystemSoccerOdds;

    constructor( http: Http, externalSystem: ExternalSystemSoccerOdds )
    {
        this.http = http;
        this.externalSystem = externalSystem;
        let externalSystemRepository = new ExternalSystemRepository(http);
        this.externalObjectRepository = new ExternalObjectRepository(http, externalSystemRepository );
    }

    getToken(): string
    {
        return "0UcAt1xsSWmshJ5q1s0jjHZ6iWO3p1euSe0jsnrSR3odKAKsWU";
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
        let url = this.url + '/leagues';
        return this.http.get(url, new RequestOptions({ headers: this.getHeaders() }) )
            .map((res) => this.jsonCompetitionsToArrayHelper(res.json(), appCompetitions ))
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
        let competition = new Competition(json.name);
        competition.setId(json.leagueId);

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
