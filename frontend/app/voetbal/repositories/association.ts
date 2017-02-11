/**
 * Created by coen on 30-1-17.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Association } from '../domain/association';

@Injectable()
export class AssociationRepository {

    private headers = new Headers({'Content-Type': 'application/json'});
    private url : string = "http://localhost:2999/voetbal/associations";
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

    getObjects(): Observable<Association[]>
    {
        return this.http.get(this.url, new RequestOptions({ headers: this.getHeaders() }) )
            .map((res) => this.jsonArrayToObject(res))
            .catch( this.handleError );
    }

    private jsonArrayToObject( res: Response ): Association[]
    {
        let associations: Association[] = [];
        for (let json of res.json()) {
            let object = this.jsonToObjectHelper(json);
            associations.push( object );
        }
        return associations;
    }

    getObject( id: number): Observable<Association>
    {
        let url = this.url + '/'+id;
        return this.http.get(url)
        // ...and calling .json() on the response to return data
            .map(this.jsonToObject)
            //...errors if any
            .catch((error:any) => Observable.throw(error.message || 'Server error' ));
    }

    createObject( jsonObject: any ): Observable<Association>
    {
        return this.http
            .post(this.url, jsonObject, new RequestOptions({ headers: this.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObject(res))
            //...errors if any
            .catch(this.handleError);
    }

    private jsonToObject( res: Response ): Association
    {
        return this.jsonToObjectHelper( res.json() );
    }

    private jsonToObjectHelper( jsonAssociation : any ): Association
    {
        let association = new Association(jsonAssociation.name);
        association.setId(jsonAssociation.id);
        return association;
    }

    editObject( object: Association ): Observable<Association>
    {
        let url = this.url + '/'+object.getId();
        return this.http
            .put(url, JSON.stringify( object ), new RequestOptions({ headers: this.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res:Response) => res.json())
            //...errors if any
            .catch(this.handleError);
    }

    removeObject( object: Association): Observable<void>
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
