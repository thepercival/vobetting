/**
 * Created by coen on 13-2-17.
 */

/**
 * Created by cdunnink on 7-2-2017.
 */

import { ExternalObject } from '../object';
import { ExternalSystemRepository } from '../system/repository';
import { Injectable } from '@angular/core';

import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ExternalSystem } from '../system';

@Injectable()
export class ExternalObjectRepository {

    private url : string = "http://localhost:2999/voetbal/external";
    private http: Http;
    private externalSystemRepository: ExternalSystemRepository;

    constructor( http: Http, externalSystemRepository: ExternalSystemRepository )
    {
        this.http = http;
        this.externalSystemRepository = externalSystemRepository;
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

    jsonToArrayHelper( jsonArray : any, importableObject: any ): ExternalObject[]
    {
        let externalObjects: ExternalObject[] = [];
        if ( jsonArray == null ){
            return externalObjects;
        }
        for (let json of jsonArray) {
            externalObjects.push( this.jsonToObjectHelper(json,importableObject) );
        }
        return externalObjects;
    }

    jsonToObjectHelper( json : any, importableObject: any ): ExternalObject
    {
        let externalSystem = null;
        if ( json.externalsystem != null ){
            externalSystem = this.externalSystemRepository.jsonToObjectHelper( json.externalsystem );
        }
        let externalObject = new ExternalObject(importableObject, externalSystem, json.externalid );
        externalObject.setId(json.id);
        return externalObject;
    }

    createObject( urlpostfix:string, object: any, externalid: string, externalSystem: ExternalSystem ): Observable<ExternalObject>
    {
        let json = {"importableobjectid":object.getId(), "externalid":externalid, "externalsystemid":externalSystem.getId()};
        let url = this.url + '/'+urlpostfix;
        console.log(json);
        return this.http
            .post(url, json, new RequestOptions({ headers: this.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res.json(),object))
            //...errors if any
            .catch(this.handleError);
    }

    removeObject( urlpostfix:string, object: ExternalObject): Observable<void>
    {
        let url = this.url + '/'+urlpostfix + '/'+object.getId();

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

