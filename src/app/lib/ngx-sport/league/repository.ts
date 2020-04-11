import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../repository';
import { LeagueMapper, League, JsonLeague } from 'ngx-sport';

@Injectable()
export class LeagueRepository extends APIRepository {

    constructor(
        private mapper: LeagueMapper, private http: HttpClient) {
        super();
    }

    getUrl(id?: string | number): string {
        return super.getApiUrl() + 'voetbal/leagues' + (id ? ('/' + id) : '');
    }

    getObject(id: any): Observable<League> {
        return this.http.get(this.getUrl(id), this.getOptions()).pipe(
            map((json: JsonLeague) => this.mapper.toObject(json)),
            catchError((err) => this.handleError(err))
        );
    }

    getObjects(): Observable<League[]> {
        return this.http.get(this.getUrl(), this.getOptions()).pipe(
            map((json: JsonLeague[]) => json.map(jsonLeague => this.mapper.toObject(jsonLeague))),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(json: JsonLeague): Observable<League> {
        return this.http.post(this.getUrl(), json, this.getOptions()).pipe(
            map((jsonLeague: JsonLeague) => this.mapper.toObject(jsonLeague)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(league: League): Observable<League> {
        const url = this.getUrl(league.getId());
        return this.http.put(url, this.mapper.toJson(league), this.getOptions()).pipe(
            map((jsonLeague: JsonLeague) => this.mapper.toObject(jsonLeague, league)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(league: League): Observable<League> {
        return this.http.delete(this.getUrl(league.getId()), { headers: super.getHeaders() }).pipe(
            map((res: League) => res),
            catchError((err) => this.handleError(err))
        );
    }

}
