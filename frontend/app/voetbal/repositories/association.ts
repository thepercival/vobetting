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

@Injectable()
export class AssociationRepository implements VoetbalRepositoryInterface{

    private headers = new Headers({'Content-Type': 'application/json'});
    private url : string = "http://localhost:2999/associations";
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
        let headers = new Headers({'Content-Type': 'application/json'});
        if ( this.getToken() != null ) {
            headers.append( 'Authorization', 'Bearer ' + this.getToken() );
        }
        return headers;
    }

    getObjects(): Observable<VoetbalInterface[]>
    {
        return this.http.get(this.url, new RequestOptions({ headers: this.getHeaders() }) )
            .map((res:Response) => res.json())
            .catch( this.handleError );
    }

    getObject( id: number): Observable<VoetbalInterface>
    {
        let url = this.url + '/$'+id;
        return this.http.get(url)
        // ...and calling .json() on the response to return data
            .map((res:Response) => res.json())
            //...errors if any
            .catch((error:any) => Observable.throw(error.message || 'Server error' ));
    }

    createObject( object: VoetbalInterface ): Observable<VoetbalInterface>
    {
        return this.http
            .post(this.url, JSON.stringify( object ), {headers: this.headers})
            // ...and calling .json() on the response to return data
            .map((res:Response) => res.json())
            //...errors if any
            .catch(this.handleError);
    }

    editObject( object: VoetbalInterface ): Observable<VoetbalInterface>
    {
        let url = this.url + '/$'+object.getId();
        return this.http
            .put(url, JSON.stringify( object ), {headers: this.headers})
            // ...and calling .json() on the response to return data
            .map((res:Response) => res.json())
            //...errors if any
            .catch(this.handleError);
    }

    removeObject( object: VoetbalInterface): Observable<void>
    {
        let url = this.url + '/$'+object.getId();
        return this.http
            .delete(url, {headers: this.headers})
            // ...and calling .json() on the response to return data
            .map((res:Response) => res.json())
            //...errors if any
            .catch(this.handleError);
    }

    // this could also be a private method of the component class
    handleError(error: any): Observable<any> {
        console.error( error.statusText );
        // throw an application level error
        return Observable.throw( error.statusText );
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
