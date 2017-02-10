/**
 * Created by coen on 10-2-17.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Competition } from '../domain/competition';

@Injectable()
export class CompetitionRepository {

    private headers = new Headers({'Content-Type': 'application/json'});
    private url : string = "http://localhost:2999/voetbal/competitions";
    private http: Http;

    constructor( http: Http )
    {
        this.http = http;
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
        let headers = new Headers(this.headers);
        if ( this.getToken() != null ) {
            headers.append( 'Authorization', 'Bearer ' + this.getToken() );
        }
        return headers;
    }

    getObjects(): Observable<Competition[]>
    {
        return this.http.get(this.url, new RequestOptions({ headers: this.getHeaders() }) )
            .map(this.jsonArrayToObject)
            .catch( this.handleError );
    }

    jsonToObjectHelper( jsonCompetition : any ): Competition
    {
        let competition = new Competition(jsonCompetition.name);
        competition.setId(jsonCompetition.id);
        return competition;
    }

    jsonArrayToObject( res: Response ): Competition[]
    {
        let competitions: Competition[] = [];
        for (let jsonCompetition of res.json()) {
            // let x = this.jsonToObjectHelper(jsonCompetition);
            let competition = new Competition(jsonCompetition.name);
            competition.setId(jsonCompetition.id);
            competitions.push( competition );
        }
        return competitions;
    }

    jsonToObject( res: Response ): Competition
    {
        let jsonCompetition = res.json();
        let competition = new Competition(jsonCompetition.name);
        competition.setId(jsonCompetition.id);
        // competitions.push( competition );
        return competition; // this.jsonToObjectHelper( res.json() );
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

    createObject( jsonObject: any ): Observable<Competition>
    {
        return this.http
            .post(this.url, jsonObject, new RequestOptions({ headers: this.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map(this.jsonToObject)
            //...errors if any
            .catch(this.handleError);
    }

    editObject( object: Competition ): Observable<Competition>
    {
        let url = this.url + '/'+object.getId();
        return this.http
            .put(url, JSON.stringify( object ), new RequestOptions({ headers: this.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res:Response) => res.json())
            //...errors if any
            .catch(this.handleError);
    }

    removeObject( object: Competition): Observable<void>
    {
        let url = this.url + '/'+object.getId();
        return this.http
            .delete(url, new RequestOptions({ headers: this.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res:Response) => res)
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