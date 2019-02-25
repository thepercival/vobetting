import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ExternalSystemMapper, ExternalSystemRepository, SportRepository } from 'ngx-sport';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BetLine } from '../betline';
import { LayBack } from '../layback';
import { JsonLayBack, LayBackMapper } from './mapper';


@Injectable()
export class LayBackRepository extends SportRepository {

    private url: string;

    constructor(private http: HttpClient,
        private externalSystemRepository: ExternalSystemRepository,
        private externalSystemMapper: ExternalSystemMapper,
        private mapper: LayBackMapper,
        router: Router
    ) {
        super(router);
        this.url = super.getApiUrl() + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'laybacks';
    }

    getObjects(betLine: BetLine): Observable<LayBack[]> {
        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('betlineid', betLine.getId().toString())
        };
        return this.http.get(this.url, options).pipe(
            map((json: JsonLayBack[]) => json.map(jsonLayBack => this.mapper.toObject(jsonLayBack, betLine))),
            catchError((err) => this.handleError(err))
        );
    }

    getObject(id: number, betLine: BetLine): Observable<LayBack> {
        const url = this.url + '/' + id;
        return this.http.get(url, { headers: super.getHeaders() }).pipe(
            map((res: JsonLayBack) => this.mapper.toObject(res, betLine)),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(json: JsonLayBack, betLine: BetLine): Observable<LayBack> {
        return this.http.post(this.url, json, { headers: super.getHeaders() }).pipe(
            map((res: JsonLayBack) => this.mapper.toObject(res, betLine)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(layBack: LayBack): Observable<LayBack> {
        const url = this.url + '/' + layBack.getId();
        return this.http.put(url, this.mapper.toJson(layBack), { headers: super.getHeaders() }).pipe(
            map((res: JsonLayBack) => this.mapper.toObject(res, layBack.getBetLine(), layBack)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(object: LayBack): Observable<LayBack> {
        const url = this.url + '/' + object.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((res: LayBack) => res),
            catchError((err) => this.handleError(err))
        );
    }
}


