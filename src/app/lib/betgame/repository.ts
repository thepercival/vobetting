import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../repository';
import { PlanningPeriod, Competition, PlanningMapper } from 'ngx-sport';

@Injectable()
export class BetGameRepository extends APIRepository {

    constructor(
        private http: HttpClient) {
        super();
    }

    getUrl(): string {
        return super.getApiUrl() + 'betgames';
    }

    getObjects(filter: JsonBetGameFilter): Observable<JsonBetGame[]> {
        return this.http.post(this.getUrl(), filter, this.getOptions()).pipe(
            map((jsonBetGame: JsonBetGame[]) => {
                return jsonBetGame.map(jsonBetGame => {
                    jsonBetGame.start = new Date(jsonBetGame.start);
                    return jsonBetGame;
                });
            }),
            catchError((err) => this.handleError(err))
        );
    }
}

export interface JsonBetGame {
    gameId: string | number;
    start: Date | string;
    competitionId: string | number;
    competitionName: string;
    home: string;
    away: string;
}

export interface JsonBetGameFilter {
    start: string;
    end: string;
    competitionId?: number;
}