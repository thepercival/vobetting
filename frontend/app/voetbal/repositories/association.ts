/**
 * Created by coen on 30-1-17.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { VoetbalRepositoryInterface } from './interface';
import { VoetbalInterface } from '../domain/interface';
import { Association } from '../domain/association';

@Injectable()
export class AssociationRepository implements VoetbalRepositoryInterface{

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
            .map(this.jsonArrayToObject)
            .catch( this.handleError );
    }

    jsonToObjectHelper( jsonAssociation : any ): Association
    {
        let association = new Association(jsonAssociation.name);
        association.setId(jsonAssociation.id);
        return association;
    }

    jsonArrayToObject( res: Response ): Association[]
    {
        let associations: Association[] = [];
        for (let jsonAssociation of res.json()) {
            // let x = this.jsonToObjectHelper(jsonAssociation);
            let association = new Association(jsonAssociation.name);
            association.setId(jsonAssociation.id);
            associations.push( association );
        }
        return associations;
    }

    jsonToObject( res: Response ): Association
    {
        console.log(res.json());
        let jsonAssociation = res.json();
        let association = new Association(jsonAssociation.name);
        association.setId(jsonAssociation.id);
        // associations.push( association );
        return association; // this.jsonToObjectHelper( res.json() );
    }

    getObject( id: number): Observable<VoetbalInterface>
    {
        let url = this.url + '/'+id;
        return this.http.get(url)
        // ...and calling .json() on the response to return data
            .map(this.jsonToObject)
            //...errors if any
            .catch((error:any) => Observable.throw(error.message || 'Server error' ));
    }

    createObject( jsonObject: any ): Observable<VoetbalInterface>
    {
        return this.http
            .post(this.url, jsonObject, new RequestOptions({ headers: this.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map(this.jsonToObject)
            //...errors if any
            .catch(this.handleError);
    }

    editObject( object: VoetbalInterface ): Observable<VoetbalInterface>
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

    /////////////////////////////////////////////////////////

    /*getUsers(): Observable<User[]> {
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.token, 'Content-Type': 'application/json' });
        // let options = new RequestOptions({ headers: headers });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.usersUrl, options)
        // ...and calling .json() on the response to return data
            .map((res:Response) => res.json())
            //...errors if any
            .catch( this.handleError );
    }*/

    /*getUsersSlow(): Observable<User[]> {

     setTimeout( () => {
     this.getUsers()
     });
     var source = new Observable<User[]>(resolve =>
     setTimeout(resolve, 2000)) // delay 2 seconds
     .then(() => );
     source.forEach( x => );
     }*/

    /*ngOnInit() {
        // reset login status
        // this.authService.logout();
    }

    getUser(id: number): Observable<User> {
        // var x = this.getUsers().forEach(users => users.find(user => user.id === id));
        const url = `${this.usersUrl}/${id}`;
        return this.http.get(url)
        // ...and calling .json() on the response to return data
            .map((res:Response) => res.json())
            //...errors if any
            .catch(this.handleError);
    }

    create( newUser: User ): Observable<User> {
        return this.http
            .post(this.usersUrl, JSON.stringify( newUser ), {headers: this.headers})
            // ...and calling .json() on the response to return data
            .map((res:Response) => res.json())
            //...errors if any
            .catch(this.handleError);
    }*/

    /*update(user: User): Observable<User> {

     const url = `${this.usersUrl}/${user.id}`;
     return this.http
     .put(url, JSON.stringify(user), {headers: this.headers})
     // ...and calling .json() on the response to return data
     .map((res:Response) => res.json())
     //...errors if any
     .catch(this.handleError);
     }

     delete(id: number): Observable<void> {
     const url = `${this.usersUrl}/${id}`;
     return this.http
     .delete(url, {headers: this.headers})
     // ...and calling .json() on the response to return data
     .map((res:Response) => res.json())
     //...errors if any
     .catch(this.handleError);
     }*/
}
