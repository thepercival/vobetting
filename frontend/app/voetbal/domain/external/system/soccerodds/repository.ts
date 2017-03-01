/**
 * Created by coen on 30-1-17.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Competition } from '../../../competition';
import { ExternalObjectRepository } from '../../object/repository';
import { ExternalSystemSoccerOdds } from '../soccerodds';
import { ExternalSystemRepository } from '../repository';

@Injectable()
export class ExternalSystemSoccerOddsRepository{

    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(
        private http: Http,
        private externalSystem: ExternalSystemSoccerOdds,
        private externalSystemRepository: ExternalSystemRepository
    )
    {
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

    getCompetitions(): Observable<Competition[]>
    {
        let url = this.externalSystem.getApiurl() + 'leagues';
        return this.http.get(url, new RequestOptions({ headers: this.getHeaders() }) )
            .map((res) => this.jsonCompetitionsToArrayHelper(res.json() ))
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
        let competition = new Competition(json.name);
        competition.setId(json.leagueId);
        competition.setAbbreviation(competition.getName().substr(0,Competition.MAX_LENGTH_ABBREVIATION));

        return competition;
    }

    // this could also be a private method of the component class
    handleError(res: Response): Observable<any> {
        console.error( res );
        // throw an application level error
        return Observable.throw( res.statusText );
    }
}
