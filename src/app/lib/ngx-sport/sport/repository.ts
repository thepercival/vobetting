import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../repository';
import { SportMapper, Sport, JsonSport } from 'ngx-sport';

@Injectable()
export class SportRepository extends APIRepository {

    constructor(
        private mapper: SportMapper, private http: HttpClient) {
        super();
    }

    getUrl(id?: string | number): string {
        return super.getApiUrl() + 'voetbal/sports' + (id ? ('/' + id) : '');
    }

    getObject(id: any): Observable<Sport> {
        return this.http.get(this.getUrl(id), this.getOptions()).pipe(
            map((json: JsonSport) => this.mapper.toObject(json)),
            catchError((err) => this.handleError(err))
        );
    }

    getObjects(): Observable<Sport[]> {
        return this.http.get(this.getUrl(), this.getOptions()).pipe(
            map((json: JsonSport[]) => json.map(jsonSport => this.mapper.toObject(jsonSport))),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(json: JsonSport): Observable<Sport> {
        return this.http.post(this.getUrl(), json, this.getOptions()).pipe(
            map((jsonSport: JsonSport) => this.mapper.toObject(jsonSport)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(sport: Sport): Observable<Sport> {
        const url = this.getUrl(sport.getId());
        return this.http.put(url, this.mapper.toJson(sport), this.getOptions()).pipe(
            map((jsonSport: JsonSport) => this.mapper.updateObject(jsonSport, sport)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(sport: Sport): Observable<Sport> {
        return this.http.delete(this.getUrl(sport.getId()), { headers: super.getHeaders() }).pipe(
            map((res: Sport) => res),
            catchError((err) => this.handleError(err))
        );
    }

}
