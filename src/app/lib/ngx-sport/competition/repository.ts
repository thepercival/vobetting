import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../repository';
import { CompetitionMapper, Competition, JsonCompetition } from 'ngx-sport';

@Injectable()
export class CompetitionRepository extends APIRepository {

    constructor(
        private mapper: CompetitionMapper, private http: HttpClient) {
        super();
    }

    getUrlpostfix(): string {
        return 'competitions';
    }

    getUrl(id?: string | number): string {
        return super.getApiUrl() + 'voetbal/competitions' + (id ? ('/' + id) : '');
    }

    getObject(id: string | number): Observable<Competition> {
        return this.http.get(this.getUrl(id), this.getOptions()).pipe(
            map((json: JsonCompetition) => this.mapper.toObject(json)),
            catchError((err) => this.handleError(err))
        );
    }

    getObjects(): Observable<Competition[]> {
        return this.http.get(this.getUrl(), this.getOptions()).pipe(
            map((json: JsonCompetition[]) => json.map(jsonCompetition => this.mapper.toObject(jsonCompetition))),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(json: JsonCompetition): Observable<Competition> {
        return this.http.post(this.getUrl(), json, this.getOptions()).pipe(
            map((jsonCompetition: JsonCompetition) => this.mapper.toObject(jsonCompetition)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(competition: Competition): Observable<Competition> {
        const url = this.getUrl(competition.getId());
        return this.http.put(url, this.mapper.toJson(competition), this.getOptions()).pipe(
            map((jsonCompetition: JsonCompetition) => this.mapper.toObject(jsonCompetition, competition)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(competition: Competition): Observable<Competition> {
        return this.http.delete(this.getUrl(competition.getId()), { headers: super.getHeaders() }).pipe(
            map((res: Competition) => res),
            catchError((err) => this.handleError(err))
        );
    }

}
