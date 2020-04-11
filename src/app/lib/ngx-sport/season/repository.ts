import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../repository';
import { SeasonMapper, Season, JsonSeason } from 'ngx-sport';

@Injectable()
export class SeasonRepository extends APIRepository {

    constructor(
        private mapper: SeasonMapper, private http: HttpClient) {
        super();
    }

    getUrl(id?: string | number): string {
        return super.getApiUrl() + 'voetbal/seasons' + (id ? ('/' + id) : '');
    }

    getObject(id: any): Observable<Season> {
        return this.http.get(this.getUrl(id), this.getOptions()).pipe(
            map((json: JsonSeason) => this.mapper.toObject(json)),
            catchError((err) => this.handleError(err))
        );
    }

    getObjects(): Observable<Season[]> {
        return this.http.get(this.getUrl(), this.getOptions()).pipe(
            map((json: JsonSeason[]) => json.map(jsonSeason => this.mapper.toObject(jsonSeason))),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(json: JsonSeason): Observable<Season> {
        return this.http.post(this.getUrl(), json, this.getOptions()).pipe(
            map((jsonSeason: JsonSeason) => this.mapper.toObject(jsonSeason)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(season: Season): Observable<Season> {
        const url = this.getUrl(season.getId());
        return this.http.put(url, this.mapper.toJson(season), this.getOptions()).pipe(
            map((jsonSeason: JsonSeason) => this.mapper.toObject(jsonSeason, season)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(season: Season): Observable<Season> {
        return this.http.delete(this.getUrl(season.getId()), { headers: super.getHeaders() }).pipe(
            map((res: Season) => res),
            catchError((err) => this.handleError(err))
        );
    }

}
