import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Competition, Game } from 'ngx-sport';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


import { APIRepository } from '../repository';
import { BetLine } from '../betline';
import { BetLineMapper, JsonBetLine } from './mapper';

@Injectable()
export class BetLineRepository extends APIRepository {

    private url: string;

    constructor(
        private http: HttpClient,
        private mapper: BetLineMapper
    ) {
        super();
    }

    getUrlpostfix(): string {
        return 'betlines';
    }

    protected getUrl(game?: Game): string {
        return super.getApiUrl() + this.getUrlpostfix() + (game ? ('/' + game.getId()) : '');

    }

    getObjects(game: Game): Observable<BetLine[]> {
        return this.http.get(this.getUrl(game), this.getOptions()).pipe(
            map((json: JsonBetLine[]) => json.map(jsonBetLine => this.mapper.toObject(jsonBetLine, game))),
            catchError((err) => this.handleError(err))
        );
    }

    // createObject(json: JsonBetLine, game: Game): Observable<BetLine> {
    //     const options = {
    //         headers: super.getHeaders(),
    //         params: new HttpParams().set('gameid', game.getId().toString())
    //     };
    //     return this.http.post(this.url, json, options).pipe(
    //         map((res: JsonBetLine) => this.mapper.toObject(res, game)),
    //         catchError((err) => this.handleError(err))
    //     );
    // }

    // editObject(betLine: BetLine): Observable<BetLine> {
    //     const options = {
    //         headers: super.getHeaders(),
    //         params: new HttpParams().set('gameid', betLine.getGame().getId().toString())
    //     };
    //     const url = this.url + '/' + betLine.getId();
    //     return this.http.put(url, this.mapper.toJson(betLine), options).pipe(
    //         map((res: JsonBetLine) => this.mapper.toObject(res, betLine.getGame(), betLine)),
    //         catchError((err) => this.handleError(err))
    //     );
    // }

    // removeObject(object: BetLine): Observable<BetLine> {
    //     const url = this.url + '/' + object.getId();
    //     return this.http.delete(url, { headers: super.getHeaders() }).pipe(
    //         map((res: BetLine) => res),
    //         catchError((err) => this.handleError(err))
    //     );
    // }
}

export interface BetLineFilter {
    competition: Competition;
    startDateTime: Date;
    endDateTime: Date;
    betType: number;
}
