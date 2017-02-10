/**
 * Created by cdunnink on 7-2-2017.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ExternalSystem } from '../../domain/external/system';

@Injectable()
export class ExternalSystemRepository {

    private headers = new Headers({'Content-Type': 'application/json'});
    private url : string = "http://localhost:2999/voetbal/external/systems";
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

    getObjects(): Observable<ExternalSystem[]>
    {
        return this.http.get(this.url, new RequestOptions({ headers: this.getHeaders() }) )
            .map(this.jsonArrayToObject)
            .catch( this.handleError );
    }

    /*jsonToObjectHelper( json : any ): ExternalSystem
    {
        let externalSystem = new ExternalSystem(json.name);
        externalSystem.setId(json.id);
        return externalSystem;
    }*/

    jsonArrayToObject( res: Response ): ExternalSystem[]
    {
        let objects: ExternalSystem[] = [];
        for (let json of res.json()) {
            // let x = this.jsonToObjectHelper(jsonExternalSystem);
            let object = new ExternalSystem(json.name);
            object.setId(json.id);
            object.setWebsite(json.website);
            objects.push( object );
        }
        return objects;
    }

    jsonToObject( res: Response ): ExternalSystem
    {
        let json = res.json();
        let object = new ExternalSystem(json.name);
        object.setId(json.id);
        object.setWebsite(json.website);
        // associations.push( association );
        return object; // this.jsonToObjectHelper( res.json() );
    }

    getObject( id: number): Observable<ExternalSystem>
    {
        let url = this.url + '/'+id;
        return this.http.get(url)
        // ...and calling .json() on the response to return data
            .map(this.jsonToObject)
            //...errors if any
            .catch((error:any) => Observable.throw(error.message || 'Server error' ));
    }

    createObject( jsonObject: any ): Observable<ExternalSystem>
    {
        return this.http
            .post(this.url, jsonObject, new RequestOptions({ headers: this.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map(this.jsonToObject)
            //...errors if any
            .catch(this.handleError);
    }

    editObject( object: ExternalSystem ): Observable<ExternalSystem>
    {
        let url = this.url + '/'+object.getId();
        return this.http
            .put(url, JSON.stringify( object ), new RequestOptions({ headers: this.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res:Response) => res.json())
            //...errors if any
            .catch(this.handleError);
    }

    removeObject( object: ExternalSystem): Observable<void>
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