/**
 * Created by coen on 30-1-17.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Competition } from '../../../domain/competition';

@Injectable()
export class ExternalSystemSoccerOddsRepository{

    private headers = new Headers({'Content-Type': 'application/json'});
    private url : string = "https://arisalexis-soccer-odds-v1.p.mashape.com";
    private http: Http;

    constructor( http: Http )
    {
        this.http = http;
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

    getCompetitions(): Observable<Competition[]>
    {
        let url = this.url + '/leagues';
        return this.http.get(url, new RequestOptions({ headers: this.getHeaders() }) )
            .map((res) => this.jsonArrayToObject(res))
            .catch( this.handleError );
    }

    private jsonArrayToObject( res: Response ): Competition[]
    {
        let competitions: Competition[] = [];
        for (let json of res.json()) {
            let object = this.jsonToObjectHelper(json);
            competitions.push( object );
        }
        return competitions;
    }

    getObject( id: number): Observable<Competition>
    {
        let url = this.url + '/'+id;
        return this.http.get(url)
        // ...and calling .json() on the response to return data
            .map(this.jsonToObject)
            //...errors if any
            .catch((error:any) => Observable.throw(error.message || 'Server error' ));

    }

    private jsonToObject( res: Response ): Competition
    {
        return this.jsonToObjectHelper( res.json() );
    }

    private jsonToObjectHelper( json : any ): Competition
    {
        console.log(json);
        let competition = new Competition(json.name);
        competition.setId(json.id);
        return competition;
    }

    // this could also be a private method of the component class
    handleError(res: Response): Observable<any> {
        console.error( res );
        // throw an application level error
        return Observable.throw( res.statusText );
    }
}
