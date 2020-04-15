import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../repository';
import { ExternalSourceMapper, JsonExternalSource } from './mapper';
import { ExternalSource } from '../source';
import { JsonAssociation, AssociationMapper, Association, Sport, JsonSport, SportMapper } from 'ngx-sport';
@Injectable()
export class ExternalSourceRepository extends APIRepository {

    private url: string;

    constructor(
        private http: HttpClient,
        private mapper: ExternalSourceMapper) {
        super();
        this.url = super.getApiUrl() + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'externalsources';
    }

    protected getUrl(id: number, objectType?: string): string {
        return this.url + '/' + id + (objectType ? ('/' + objectType) : '');
    }

    getObject(id: any): Observable<ExternalSource> {
        return this.http.get(this.getUrl(id), this.getOptions()).pipe(
            map((json: JsonExternalSource) => this.mapper.toObject(json)),
            catchError((err) => this.handleError(err))
        );
    }

    getObjects(): Observable<ExternalSource[]> {
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

    createObject(json: JsonExternalSource): Observable<ExternalSource> {
        return this.http.post(this.url, json, { headers: super.getHeaders() }).pipe(
            map((jsonRes: JsonExternalSource) => this.mapper.toObject(jsonRes)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(externalSource: ExternalSource): Observable<ExternalSource> {
        const options = { headers: super.getHeaders() };
        const url = this.getUrl(externalSource.getId());
        return this.http.put(url, this.mapper.toJson(externalSource), options).pipe(
            map((res: JsonExternalSource) => this.mapper.toObject(res, externalSource)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(externalSource: ExternalSource): Observable<void> {
        return this.http.delete(this.getUrl(externalSource.getId()), { headers: super.getHeaders() }).pipe(
            map((res) => res),
            catchError((err) => this.handleError(err))
        );
    }
}
