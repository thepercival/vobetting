/**
 * Created by coen on 3-3-17.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { CompetitionSeason } from '../../competitionseason';
import { Round } from '../round';
import { RoundRepository} from '../round/repository';

@Injectable()
export class CompetitionSeasonStructureRepository {

    private url : string;
    private http: Http;

    constructor( http: Http, private roundRepos: RoundRepository )
    {
        this.http = http;
        this.url = "http://localhost:2999/voetbal/" + this.getUrlpostfix();
    }

    getUrlpostfix(): string
    {
        return 'structures';
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

    getObject( competitionseason: CompetitionSeason ): Observable<Round[]>
    {
        return this.http.get(this.url, new RequestOptions({ headers: this.getHeaders() }) )
            .map((res) => {
                let objects = this.roundRepos.jsonArrayToObject(res.json(),competitionseason);
                return objects;
            })
            .catch( this.handleError );
    }

    // createObject( jsonObject: any ): Observable<Association>
    // {
    //     return this.http
    //         .post(this.url, jsonObject, new RequestOptions({ headers: this.getHeaders() }))
    //         // ...and calling .json() on the response to return data
    //         .map((res) => this.jsonToObjectHelper(res.json()))
    //         //...errors if any
    //         .catch(this.handleError);
    // }


    // editObject( object: Association ): Observable<Association>
    // {
    //     let url = this.url + '/'+object.getId();
    //     return this.http
    //         .put(url, JSON.stringify( object ), new RequestOptions({ headers: this.getHeaders() }))
    //         // ...and calling .json() on the response to return data
    //         .map((res) => this.jsonToObjectHelper(res.json()))
    //         //...errors if any
    //         .catch(this.handleError);
    // }

    // removeObject( object: Association): Observable<void>
    // {
    //     let url = this.url + '/'+object.getId();
    //     return this.http
    //         .delete(url, new RequestOptions({ headers: this.getHeaders() }))
    //         // ...and calling .json() on the response to return data
    //         .map((res:Response) => res)
    //         //...errors if any
    //         .catch(this.handleError);
    // }

    // this could also be a private method of the component class
    handleError(res: Response): Observable<any> {
        console.error( res );
        // throw an application level error
        return Observable.throw( res.statusText );
    }
}