/**
 * Created by coen on 20-3-17.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, URLSearchParams } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Game } from '../game';
import { Poule } from '../poule';
import { PoulePlaceRepository } from '../pouleplace/repository';
import { PoulePlace } from '../pouleplace';
import { CompetitionSeason } from '../competitionseason';
import { StructureService } from '../structure/service';

@Injectable()
export class GameRepository {

    private url : string;

    constructor(
        private http: Http,
        private pouleplaceRepos: PoulePlaceRepository )
    {
        this.url = "http://localhost:2999/voetbal/" + this.getUrlpostfix();
    }

    getUrlpostfix(): string
    {
        return 'games';
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

    // getObjects( structureService: StructureService ): Observable<Game[]>
    // {
    //     let params: URLSearchParams = new URLSearchParams();
    //     params.set('competitionseasonid', structureService.getCompetitionSeason().getId() );
    //     let requestOptions = new RequestOptions();
    //     requestOptions.headers = this.getHeaders();
    //     requestOptions.search = params;
    //
    //     let pouleplaces = structureService.getPoulePlaces();
    //
    //     // add competitionseasonid to url
    //     return this.http.get(this.url, requestOptions )
    //         .map((res) => this.jsonArrayToObject(res.json(), poule) )
    //         .catch( this.handleError );
    // }

    jsonArrayToObject( jsonArray: any, poule: Poule ): Game[]
    {
        let objects: Game[] = [];
        for (let json of jsonArray) {
            let object = this.jsonToObjectHelper(json,poule);
            objects.push( object );
        }
        return objects;
    }

    jsonToObjectHelper( json : any, poule: Poule ): Game
    {
        let game = new Game(
            json.number,
            new Date(json.startdate),
            poule.getPlaces().find( pouleplaceIt => json.homepouleplace.id == pouleplaceIt.getId() ),
            poule.getPlaces().find( pouleplaceIt => json.awaypouleplace.id == pouleplaceIt.getId() )
        );
        game.setId(json.id);
        game.setState(json.state);
        poule.getGames().push(game);
        return game;
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

    objectToJsonHelper( object : Game ): any
    {
        let json = {
            "id":object.getId(),
            "number":object.getNumber(),
            "startdate":object.getStartdate().toISOString(),
            "homepouleplace":this.pouleplaceRepos.objectToJsonHelper(object.getHomePoulePlace()),
            "awaypouleplace":this.pouleplaceRepos.objectToJsonHelper(object.getAwayPoulePlace()),
            "state":object.getState()
        };
        return json;
    }

    createObject( jsonObject: any, poule: Poule ): Observable<Game>
    {
        return this.http
            .post(this.url, jsonObject, new RequestOptions({ headers: this.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res.json(), poule))
            //...errors if any
            .catch(this.handleError);
    }

    removeObject( object: Game): Observable<void>
    {
        let url = this.url + '/'+object.getId();
        return this.http
            .delete(url, new RequestOptions({ headers: this.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res:Response) => {

            })
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