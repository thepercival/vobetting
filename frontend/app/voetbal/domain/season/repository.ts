/**
 * Created by coen on 10-2-17.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Season } from '../season';

@Injectable()
export class SeasonRepository {

    private url : string;
    private http: Http;

    constructor( http: Http )
    {
        this.http = http;
        this.url = "http://localhost:2999/voetbal/" + this.getUrlpostfix();
    }

    getUrlpostfix(): string
    {
        return 'seasons';
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

    getObjects(): Observable<Season[]>
    {
        return this.http.get(this.url, new RequestOptions({ headers: this.getHeaders() }) )
            .map((res) => this.jsonToArrayHelper(res.json()))
            .catch( this.handleError );
    }

    jsonToArrayHelper( jsonArray : any ): Season[]
    {
        let seasons: Season[] = [];
        for (let json of jsonArray) {
            let object = this.jsonToObjectHelper(json);
            seasons.push( object );
        }
        return seasons;
    }

    getObject( id: number): Observable<Season>
    {
        let url = this.url + '/'+id;
        return this.http.get(url)
        // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res.json()))
            //...errors if any
            .catch((error:any) => Observable.throw(error.message || 'Server error' ));
    }

    jsonToObjectHelper( json : any ): Season
    {
        console.log(json);
        let season = new Season(json.name);
        season.setId(json.id);
        season.setStartdate(new Date(json.startdate.timestamp*1000));
        season.setEnddate(new Date(json.enddate.timestamp*1000));
        return season;
    }

    createObject( jsonObject: any ): Observable<Season>
    {
        return this.http
            .post(this.url, jsonObject, new RequestOptions({ headers: this.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res.json()))
            //...errors if any
            .catch(this.handleError);
    }

    editObject( object: Season ): Observable<Season>
    {
        let url = this.url + '/'+object.getId();
console.log(JSON.stringify( object ));
        return this.http
            .put(url, JSON.stringify( object ), { headers: this.getHeaders() })
            // ...and calling .json() on the response to return data
            .map((res) => { return this.jsonToObjectHelper(res.json()); })
            //...errors if any
            .catch(this.handleError);
    }

    removeObject( object: Season): Observable<void>
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
