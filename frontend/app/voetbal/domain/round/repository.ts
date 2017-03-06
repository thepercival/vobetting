/**
 * Created by coen on 3-3-17.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { CompetitionSeason } from '../competitionseason';
import { PouleRepository } from '../poule/repository';
import { Round } from '../round';
import { CompetitionSeasonRepository } from '../competitionseason/repository';

@Injectable()
export class RoundRepository {

    private url : string;

    constructor(
        private http: Http,
        private pouleRepos: PouleRepository,
        private competitionseasonRepos: CompetitionSeasonRepository )
    {
        this.url = "http://localhost:2999/voetbal/" + this.getUrlpostfix();
    }

    getUrlpostfix(): string
    {
        return 'rounds';
    }

    getToken(): string
    {
        let user = JSON.parse( localStorage.getItem('user') );
        if ( user != null && user.token != null ) {
            return user.token;
        }
        return null;
    }

    getHeaders(): Headers
    {
        let headers = new Headers({'Content-Type': 'application/json;charset=utf-8'});
        if ( this.getToken() != null ) {
            headers.append( 'Authorization', 'Bearer ' + this.getToken() );
        }
        return headers;
    }

    getObjects( competitionSeason: CompetitionSeason ): Observable<Round[]>
    {
        // add competitionseasonid to url
        return this.http.get(this.url, new RequestOptions({ headers: this.getHeaders() }) )
            .map((res) => this.jsonArrayToObject(res.json(), competitionSeason))
            .catch( this.handleError );
    }

    jsonArrayToObject( jsonArray: any, competitionSeason: CompetitionSeason ): Round[]
    {
        let objects: Round[] = [];
        for (let json of jsonArray) {
            let object = this.jsonToObjectHelper(json, competitionSeason);
            objects.push( object );
        }
        return objects;
    }

    jsonToObjectHelper( json : any, competitionseason: CompetitionSeason ): Round
    {
        let round = new Round(competitionseason, json.number);
        round.setName(json.name);
        this.pouleRepos.jsonArrayToObject( json.poules, round );
        return round;
    }

    objectsToJsonHelper( objects: any[] ): any[]
    {
        let jsonArray: any[] = [];
        for (let object of objects) {
            let json = this.objectToJsonHelper(object);
            jsonArray.push( json );
        }
        return jsonArray;
    }

    objectToJsonHelper( object : Round ): any
    {
        let json = {
            "id":object.getId(),
            "number":object.getNumber(),
            "name":object.getName(),
            "competitionseason":this.competitionseasonRepos.objectToJsonHelper(object.getCompetitionSeason()),
            "poules":this.pouleRepos.objectsToJsonHelper(object.getPoules())
        };
        return json;
    }

    createObject( jsonObject: any, competitionseason: CompetitionSeason ): Observable<Round>
    {
        return this.http
            .post(this.url, jsonObject, new RequestOptions({ headers: this.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res.json(), competitionseason))
            //...errors if any
            .catch(this.handleError);
    }

    // this could also be a private method of the component class
    handleError(res: Response): Observable<any> {
        console.error( res );
        // throw an application level error
        return Observable.throw( res.statusText );
    }
}