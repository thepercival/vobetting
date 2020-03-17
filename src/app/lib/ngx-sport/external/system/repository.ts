import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../../repository';
import { ExternalSourceMapper, JsonExternalSource } from 'src/app/lib/externalsource/source/mapper';
import { ExternalSource } from 'src/app/lib/externalsource';

@Injectable()
export class ExternalSourceRepository extends APIRepository {

    private url: string;
    // private objects: ExternalSource[];
    // private specificObjects: ExternalSource[] = [];

    constructor(private http: HttpClient, private mapper: ExternalSourceMapper) {
        super();
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'externalsources';
    }

    getObjects(): Observable<ExternalSource[]> {

        // if (this.objects !== undefined) {
        //     return Observable.create(observer => {
        //         observer.next(this.objects);
        //         observer.complete();
        //     });
        // }
        return this.http.get(this.url, this.getOptions()).pipe(
            map((jsonSystems: JsonExternalSource[]) => jsonSystems.map(jsonSystem => this.mapper.toObject(jsonSystem))),
            catchError((err) => this.handleError(err))
        );
    }

    // getObject(id: number): Observable<ExternalSource> {
    //     const url = this.url + '/' + id;
    //     return this.http.get(url).pipe(
    //         map((res) => this.jsonToObject(res)),
    //         catchError((err) => this.handleError(err))
    //     );
    // }



    // private getObjectByName(name: string): ExternalSource {
    //     const foundObjects = this.specificObjects.filter(objectFilter => objectFilter.getName() === name);
    //     const foundObject = foundObjects.shift();
    //     if (foundObject) {
    //         return foundObject;
    //     }
    //     let externalSource;
    //     if (name === 'Soccer Odds') {
    //         externalSource = new ExternalSourceSoccerOdds(name, this.http, this);
    //     } else if (name === 'Soccer Sports') {
    //         externalSource = new ExternalSourceSoccerSports(name, this.http, this);
    //     } else {
    //         externalSource = new ExternalSource(name);
    //     }
    //     if (externalSource !== undefined) {
    //         this.specificObjects.push(externalSource);
    //     }
    //     return externalSource;
    // }

    createObject(json: JsonExternalSource): Observable<ExternalSource> {
        return this.http.post(this.url, json, { headers: super.getHeaders() }).pipe(
            map((jsonRes: JsonExternalSource) => this.mapper.toObject(jsonRes)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(externalSource: ExternalSource): Observable<ExternalSource> {
        const options = {
            headers: super.getHeaders()
        };
        const url = this.url + '/' + externalSource.getId();
        return this.http.put(url, this.mapper.toJson(externalSource), options).pipe(
            map((res: JsonExternalSource) => this.mapper.toObject(res, externalSource)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(object: ExternalSource): Observable<void> {
        const url = this.url + '/' + object.getId();


        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((res) => res),
            catchError((err) => this.handleError(err))
        );
    }
}


