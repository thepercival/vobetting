/**
 * Created by coen on 3-3-17.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { PoulePlace } from '../pouleplace';
import { Poule } from '../poule';
import { TeamRepository } from '../team/repository';

@Injectable()
export class PoulePlaceRepository {

    private url : string;
    private http: Http;

    constructor( http: Http, private teamRepos: TeamRepository )
    {
        this.http = http;
        this.url = "http://localhost:2999/voetbal/" + this.getUrlpostfix();
    }

    getUrlpostfix(): string
    {
        return 'pouleplaces';
    }

    // getToken(): string
    // {
    //     let user = JSON.parse( localStorage.getItem('user') );
    //     if ( user != null && user.token != null ) {
    //         return user.token;
    //     }
    //     return null;
    // }
    //
    // getHeaders(): Headers
    // {
    //     let headers = new Headers({'Content-Type': 'application/json;charset=utf-8'});
    //     if ( this.getToken() != null ) {
    //         headers.append( 'Authorization', 'Bearer ' + this.getToken() );
    //     }
    //     return headers;
    // }


    jsonArrayToObject( jsonArray: any, poule: Poule ): PoulePlace[]
    {
        let objects: PoulePlace[] = [];
        for (let json of jsonArray) {
            let object = this.jsonToObjectHelper(json, poule);
            objects.push( object );
        }
        return objects;
    }

    jsonToObjectHelper( json : any, poule: Poule ): PoulePlace
    {
        let pouleplace = new PoulePlace(poule, json.number);
        poule.setName(json.name);
        if (json.team){
            pouleplace.setTeam(this.teamRepos.jsonToObjectHelper(json.team));
        }
        poule.getPlaces().push(pouleplace);
        return pouleplace;
    }

    objectsToJsonHelper( objects: any[] ): any[]
    {
        let jsonArray: any[] = [];
        for (let object of objects) {
            let json = this.objectToJsonHelper(object);
            jsonArray.push( json );
        }
        return jsonArray;
    }

    objectToJsonHelper( object : PoulePlace ): any
    {
        let json = {
            "id":object.getId(),
            "number":object.getNumber(),
            "name":object.getName(),
            "team":this.teamRepos.objectToJsonHelper(object.getTeam())
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