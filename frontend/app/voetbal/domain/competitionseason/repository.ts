/**
 * Created by coen on 16-2-17.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { CompetitionSeason } from '../competitionseason';
import { AssociationRepository } from '../association/repository';
import { CompetitionRepository } from '../competition/repository';
import { SeasonRepository } from '../season/repository';
// import { ExternalObjectRepository } from '../external/object/repository';

@Injectable()
export class CompetitionSeasonRepository {

    private url : string;
    private http: Http;
    // private externalObjectRepository: ExternalObjectRepository;

    constructor( http: Http,
         private associationRepository: AssociationRepository,
         private competitionRepository: CompetitionRepository,
         private seasonRepository: SeasonRepository,
         /*externalObjectRepository: ExternalObjectRepository,*/
    )
    {
        this.http = http;
        //this.externalObjectRepository = externalObjectRepository;
        this.url = "http://localhost:2999/voetbal/" + this.getUrlpostfix();
    }

    getUrlpostfix(): string
    {
        return 'competitionseasons';
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

    getObjects(): Observable<CompetitionSeason[]>
    {
        return this.http.get(this.url, new RequestOptions({ headers: this.getHeaders() }) )
            .map((res) => this.jsonToArrayHelper(res.json()))
            .catch( this.handleError );
    }

    jsonToArrayHelper( jsonArray : any ): CompetitionSeason[]
    {
        let competitionseasons: CompetitionSeason[] = [];
        for (let json of jsonArray) {
            let object = this.jsonToObjectHelper(json);
            competitionseasons.push( object );
        }
        return competitionseasons;
    }

    getObject( id: number): Observable<CompetitionSeason>
    {
        let url = this.url + '/'+id;
        return this.http.get(url)
        // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res.json()))
            //...errors if any
            .catch((error:any) => Observable.throw(error.message || 'Server error' ));
    }

    jsonToObjectHelper( json : any ): CompetitionSeason
    {
        console.log(json);
        let association = this.associationRepository.jsonToObjectHelper(json.association);
        let competition = this.competitionRepository.jsonToObjectHelper(json.competition);
        let season = this.seasonRepository.jsonToObjectHelper(json.season);

        let competitionseason = new CompetitionSeason(association, competition, season);
        competitionseason.setId(json.id);
        competitionseason.setState(json.state);
        competitionseason.setQualificationrule(json.qualificationrule);
        // competitionseason.addExternals(this.externalObjectRepository.jsonToArrayHelper(json.externals,competition));
        return competitionseason;
    }

    createObject( jsonObject: any ): Observable<CompetitionSeason>
    {
        return this.http
            .post(this.url, jsonObject, new RequestOptions({ headers: this.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res.json()))
            //...errors if any
            .catch(this.handleError);
    }

    editObject( object: CompetitionSeason ): Observable<CompetitionSeason>
    {
        let url = this.url + '/'+object.getId();

        return this.http
            .put(url, JSON.stringify( object ), { headers: this.getHeaders() })
            // ...and calling .json() on the response to return data
            .map((res) => { console.log(res.json()); return this.jsonToObjectHelper(res.json()); })
            //...errors if any
            .catch(this.handleError);
    }

    removeObject( object: CompetitionSeason): Observable<void>
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
