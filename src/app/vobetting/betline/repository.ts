import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Competition, Game, GameRepository, IPoulePlace, PoulePlaceRepository, SportRepository } from 'ngx-sport';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { BetLine } from '../betline';

@Injectable()
export class BetLineRepository extends SportRepository {

    private url: string;

    constructor(private http: HttpClient,
        private gameRepository: GameRepository,
        private poulePlaceRepository: PoulePlaceRepository,
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
            map((res: IBetLine[]) => this.jsonArrayToObject(res, game)),
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
            map((res: IBetLine) => this.jsonToObjectHelper(res, game)),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(json: IBetLine, game: Game): Observable<BetLine> {
        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('gameid', game.getId().toString())
        };
        return this.http.post(this.url, json, options).pipe(
            map((res: IBetLine) => this.jsonToObjectHelper(res, game)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(betLine: BetLine): Observable<BetLine> {
        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('gameid', betLine.getGame().getId().toString())
        };
        const url = this.url + '/' + betLine.getId();
        return this.http.put(url, this.objectToJsonHelper(betLine), options).pipe(
            map((res: IBetLine) => this.jsonToObjectHelper(res, betLine.getGame(), betLine)),
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

    jsonArrayToObject(jsonArray: IBetLine[], game: Game): BetLine[] {
        const betLines: BetLine[] = [];
        for (const json of jsonArray) {
            betLines.push(this.jsonToObjectHelper(json, game));
        }
        return betLines;
    }

    jsonToObjectHelper(json: IBetLine, game: Game, betLine?: BetLine): BetLine {
        if (betLine === undefined) {
            betLine = new BetLine(game, json.betType);
        }
        betLine.setId(json.id);
        if (json.poulePlace !== undefined) {
            betLine.setPoulePlace(this.poulePlaceRepository.jsonToObjectHelper(json.poulePlace, game.getPoule()));
        }
        return betLine;
    }

    objectToJsonHelper(object: BetLine): IBetLine {
        const json: IBetLine = {
            id: object.getId(),
            betType: object.getBetType(),
            poulePlace: object.getPoulePlace() ? this.poulePlaceRepository.objectToJsonHelper(object.getPoulePlace()) : undefined
        };
        return json;
    }
}

export interface IBetLine {
    id?: number;
    betType: number;
    poulePlace?: IPoulePlace;
}

export interface BetLineFilter {
    competition: Competition;
    startDateTime: Date;
    endDateTime: Date;
    betType: number;
}
