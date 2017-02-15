/**
 * Created by cdunnink on 7-2-2017.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ExternalSystem } from '../system';
import { ExternalSystemSoccerOdds } from './soccerodds';

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
            .map( (res) => this.jsonToArrayHelper(res.json()) )
            .catch( this.handleError );
    }

    jsonToArrayHelper( jsonArray : any ): ExternalSystem[]
    {
        let objects: ExternalSystem[] = [];
        for (let json of jsonArray) {
            let object = this.jsonToObjectHelper(json);
            objects.push( object );
        }
        return objects;
    }

    getObject( id: number): Observable<ExternalSystem>
    {
        let url = this.url + '/'+id;
        return this.http.get(url)
        // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res.json()))
            //...errors if any
            .catch((error:any) => Observable.throw(error.message || 'Server error' ));
    }

    jsonToObjectHelper( json : any ): ExternalSystem
    {
        let externalSystem = this.getObjectByName(json.name);
        if (externalSystem == null){
            return externalSystem;
        }
        externalSystem.setId(json.id);
        externalSystem.setWebsite(json.website);
        externalSystem.setUsername(json.username);
        externalSystem.setPassword(json.password);
        externalSystem.setApiurl(json.apiurl);
        externalSystem.setApikey(json.apikey);
        return externalSystem;
    }

    private getObjectByName( name: string): ExternalSystem
    {
        let externalSystem;
        if ( name == "Soccer Odds" ) {
            externalSystem = new ExternalSystemSoccerOdds( name, this.http );
        }
        // else if ( name == "Seasonstest" ) {
        //     externalSystem = new ExternalSystemSeasonsTest( name, this.http );
        // }
        return externalSystem;
    }

    createObject( jsonObject: any ): Observable<ExternalSystem>
    {
        return this.http
            .post(this.url, jsonObject, new RequestOptions({ headers: this.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res.json()))
            //...errors if any
            .catch(this.handleError);
    }

    editObject( object: ExternalSystem ): Observable<ExternalSystem>
    {
        let url = this.url + '/'+object.getId();
        // console.log(JSON.stringify( object ));
        console.log(this.objectToJsonHelper(object));

        //return Observable.throw( "wat gaat er fout?" );

        return this.http
            .put(url, JSON.stringify( this.objectToJsonHelper(object) ), new RequestOptions({ headers: this.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res.json()))
            //...errors if any
            .catch(this.handleError);
    }

    objectToJsonHelper( object : ExternalSystem ): any
    {
        let json = {
            "id":object.getId(),
            "name":object.getName(),
            "website":object.getWebsite(),
            "username":object.getUsername(),
            "password":object.getPassword(),
            "apiurl":object.getApiurl(),
            "apikey":object.getApikey()
        };
        return json;
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
