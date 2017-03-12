/**
 * Created by coen on 26-2-17.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Team } from '../team';
import { ExternalObjectRepository } from '../external/object/repository';
import { AssociationRepository } from '../association/repository';
import { Association } from '../association';

@Injectable()
export class TeamRepository {

    private url : string;
    private http: Http;
    private externalObjectRepository: ExternalObjectRepository;

    constructor( http: Http, externalObjectRepository: ExternalObjectRepository, private associationRepository: AssociationRepository )
    {
        this.http = http;
        this.externalObjectRepository = externalObjectRepository;
        this.url = "http://localhost:2999/voetbal/" + this.getUrlpostfix();
    }

    getUrlpostfix(): string
    {
        return 'teams';
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

    getObjects(): Observable<Team[]>
    {
        return this.http.get(this.url, new RequestOptions({ headers: this.getHeaders() }) )
            .map((res) => this.jsonToArrayHelper(res.json()))
            .catch( this.handleError );
    }

    jsonToArrayHelper( jsonArray : any ): Team[]
    {
        let teams: Team[] = [];
        for (let json of jsonArray) {
            let object = this.jsonToObjectHelper(json);
            teams.push( object );
        }
        return teams;
    }

    getObject( id: number): Observable<Team>
    {
        let url = this.url + '/'+id;
        return this.http.get(url)
        // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res.json()))
            //...errors if any
            .catch((error:any) => Observable.throw(error.message || 'Server error' ));
    }

    jsonToObjectHelper( json : any ): Team
    {
        let association = this.associationRepository.jsonToObjectHelper(json.association);

        let team = new Team(json.name);
        team.setId(json.id);
        team.setAbbreviation(json.abbreviation);
        team.setAssociation(association);
        team.addExternals(this.externalObjectRepository.jsonArrayToObject(json.externals,team));
        return team;
    }

    createObject( jsonObject: any ): Observable<Team>
    {
        try {
            return this.http
                .post(this.url, jsonObject, new RequestOptions({ headers: this.getHeaders() }))
                // ...and calling .json() on the response to return data
                .map((res) => this.jsonToObjectHelper(res.json()))
                //...errors if any
                .catch(this.handleError);
        }
        catch( e ) {
            console.log(e);
            return Observable.throw( e );
        }
    }

    editObject( object: Team ): Observable<Team>
    {
        let url = this.url + '/'+object.getId();

        try {
            return this.http
                .put(url, this.objectToJsonHelper( object ), { headers: this.getHeaders() })
                // ...and calling .json() on the response to return data
                .map((res) => { console.log(res.json()); return this.jsonToObjectHelper(res.json()); })
                //...errors if any
                .catch(this.handleError);
        }
        catch( e ) {
            console.log(e);
            return Observable.throw( e );
        }
    }

    removeObject( object: Team): Observable<void>
    {
        let url = this.url + '/'+object.getId();
        return this.http
            .delete(url, new RequestOptions({ headers: this.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res:Response) => res)
            //...errors if any
            .catch(this.handleError);
    }

    objectToJsonHelper( object : Team ): any
    {
        let json = {
            "id":object.getId(),
            "name":object.getName(),
            "abbreviation":object.getAbbreviation(),
            "associationid":object.getAssociation().getId()
        };
        return json;
    }

    // this could also be a private method of the component class
    handleError(res: Response): Observable<any> {
        console.error( res );
        // throw an application level error
        return Observable.throw( res.statusText );
    }
}
