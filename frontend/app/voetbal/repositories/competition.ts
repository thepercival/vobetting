/**
 * Created by coen on 10-2-17.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Competition } from '../domain/competition';
import { ExternalObjectRepository } from './external/object';

@Injectable()
export class CompetitionRepository {

    private url : string;
    private http: Http;
    private externalObjectRepository: ExternalObjectRepository;

    constructor( http: Http, externalObjectRepository: ExternalObjectRepository )
    {
        this.http = http;
        this.externalObjectRepository = externalObjectRepository;
        this.url = "http://localhost:2999/voetbal/" + this.getUrlpostfix();
    }

    getUrlpostfix(): string
    {
        return 'competitions';
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
        let headers = new Headers({'Content-Type': 'application/json; charset=utf-8'});
        if ( this.getToken() != null ) {
            headers.append( 'Authorization', 'Bearer ' + this.getToken() );
        }
        return headers;
    }

    getObjects(): Observable<Competition[]>
    {
        return this.http.get(this.url, new RequestOptions({ headers: this.getHeaders() }) )
            .map((res) => this.jsonToArrayHelper(res.json()))
            .catch( this.handleError );
    }

    jsonToArrayHelper( jsonArray : any ): Competition[]
    {
        let competitions: Competition[] = [];
        for (let json of jsonArray) {
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
            .map((res) => this.jsonToObjectHelper(res.json()))
            //...errors if any
            .catch((error:any) => Observable.throw(error.message || 'Server error' ));
    }

    jsonToObjectHelper( json : any ): Competition
    {
        let competition = new Competition(json.name);
        competition.setId(json.id);
        competition.setAbbreviation(json.abbreviation);
        competition.addExternals(this.externalObjectRepository.jsonToArrayHelper(json.externals,competition));
        return competition;
    }

    createObject( jsonObject: any ): Observable<Competition>
    {
        return this.http
            .post(this.url, jsonObject, new RequestOptions({ headers: this.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res.json()))
            //...errors if any
            .catch(this.handleError);
    }

    editObject( object: Competition ): Observable<Competition>
    {
        let url = this.url + '/'+object.getId();

        return this.http
            .put(url, JSON.stringify( object ), { headers: this.getHeaders() })
            // ...and calling .json() on the response to return data
            .map((res) => { console.log(res.json()); return this.jsonToObjectHelper(res.json()); })
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
