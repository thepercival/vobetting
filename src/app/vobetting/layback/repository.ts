import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ExternalSystemMapper, JsonExternalSystem, SportRepository } from 'ngx-sport';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { BetLine } from '../betline';
import { LayBack } from '../layback';

@Injectable()
export class LayBackRepository extends SportRepository {

    private url: string;

    constructor(private http: HttpClient,
        private externalSystemMapper: ExternalSystemMapper,
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
            map((res: ILayBack[]) => this.jsonArrayToObject(res, betLine)),
            catchError((err) => this.handleError(err))
        );
    }

    getObject(id: number, betLine: BetLine): Observable<LayBack> {
        const url = this.url + '/' + id;
        return this.http.get(url, { headers: super.getHeaders() }).pipe(
            map((res: ILayBack) => this.jsonToObjectHelper(res, betLine)),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(json: ILayBack, betLine: BetLine): Observable<LayBack> {
        return this.http.post(this.url, json, { headers: super.getHeaders() }).pipe(
            map((res: ILayBack) => this.jsonToObjectHelper(res, betLine)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(layBack: LayBack): Observable<LayBack> {
        const url = this.url + '/' + layBack.getId();
        return this.http.put(url, this.objectToJsonHelper(layBack), { headers: super.getHeaders() }).pipe(
            map((res: ILayBack) => this.jsonToObjectHelper(res, layBack.getBetLine(), layBack)),
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

    jsonArrayToObject(jsonArray: ILayBack[], betLine: BetLine): LayBack[] {
        const layBacks: LayBack[] = [];
        for (const json of jsonArray) {
            layBacks.push(this.jsonToObjectHelper(json, betLine));
        }
        return layBacks;
    }

    jsonToObjectHelper(json: ILayBack, betLine: BetLine, layBack?: LayBack): LayBack {
        if (layBack === undefined) {
            layBack = new LayBack(new Date(json.dateTime), betLine);
        }
        layBack.setId(json.id);
        layBack.setBack(json.back);
        layBack.setPrice(json.price);
        layBack.setSize(json.size);
        if (json.externalSystem !== undefined) {
            layBack.setExternalSystem(this.externalSystemMapper.toObject(json.externalSystem));
        }
        return layBack;
    }

    objectToJsonHelper(object: LayBack): ILayBack {
        const json: ILayBack = {
            id: object.getId(),
            dateTime: object.getDateTime().toISOString(),
            back: object.getBack(),
            price: object.getPrice(),
            size: object.getSize(),
            externalSystem: object.getExternalSystem() ?
                this.externalSystemMapper.toJson(object.getExternalSystem()) : undefined
        };
        return json;
    }
}

export interface ILayBack {
    id?: number;
    dateTime: string;
    back: boolean;
    price: number;
    size: number;
    externalSystem?: JsonExternalSystem;
}
