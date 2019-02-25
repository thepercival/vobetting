import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Competition, Game, SportRepository } from 'ngx-sport';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BetLine } from '../betline';
import { BetLineMapper, JsonBetLine } from './mapper';

@Injectable()
export class BetLineRepository extends SportRepository {

    private url: string;

    constructor(
        private http: HttpClient,
        private mapper: BetLineMapper,
        router: Router
    ) {
        super(router);
        this.url = super.getApiUrl() + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'betlines';
    }

    getObjects(game: Game, betTypes: number): Observable<BetLine[]> {
        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('gameid', game.getId().toString())
        };
        if (betTypes !== undefined) {
            options.params = options.params.append('bettype', betTypes.toString());
        }
        return this.http.get(this.url, options).pipe(
            map((json: JsonBetLine[]) => json.map(jsonBetLine => this.mapper.toObject(jsonBetLine, game))),
            catchError((err) => this.handleError(err))
        );
    }

    getObject(id: number, game: Game): Observable<BetLine> {
        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('gameid', game.getId().toString())
        };
        const url = this.url + '/' + id;
        return this.http.get(url, options).pipe(
            map((res: JsonBetLine) => this.mapper.toObject(res, game)),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(json: JsonBetLine, game: Game): Observable<BetLine> {
        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('gameid', game.getId().toString())
        };
        return this.http.post(this.url, json, options).pipe(
            map((res: JsonBetLine) => this.mapper.toObject(res, game)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(betLine: BetLine): Observable<BetLine> {
        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('gameid', betLine.getGame().getId().toString())
        };
        const url = this.url + '/' + betLine.getId();
        return this.http.put(url, this.mapper.toJson(betLine), options).pipe(
            map((res: JsonBetLine) => this.mapper.toObject(res, betLine.getGame(), betLine)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(object: BetLine): Observable<BetLine> {
        const url = this.url + '/' + object.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((res: BetLine) => res),
            catchError((err) => this.handleError(err))
        );
    }
}



export interface BetLineFilter {
    competition: Competition;
    startDateTime: Date;
    endDateTime: Date;
    betType: number;
}
