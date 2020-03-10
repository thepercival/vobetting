import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ExternalSourceLeagueInterface } from './interface';
import { League, ExternalSource } from 'ngx-sport';

export class ExternalSourceBetFair implements ExternalSourceLeagueInterface {

    constructor(
        private http: HttpClient,
        private externalSource: ExternalSource,
        router: Router
    ) {

    }

    getApiurl(): string {
        return this.externalSource.getApiurl();
    }

    getToken(): string {
        return this.externalSource.getApikey();
    }

    getHeaders(): HttpHeaders {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
        const token = this.getToken();
        if (token !== undefined) {
            headers = headers.append('Authorization', 'Bearer ' + token);
        }
        return headers;
    }

    getLeagues(): Observable<League[]> {
        // const cacheName = 'League';
        // const jsonObjects = this.getCacheItem(cacheName);
        // if (jsonObjects !== undefined) {
        //     return Observable.create(observer => {
        //         observer.next(this.jsonLeaguesToArrayHelper(jsonObjects));
        //         observer.complete();
        //     });
        // }

        const url = this.getApiurl() + 'leagues';
        return this.http.get(url, { headers: this.getHeaders() }).pipe(
            map((res: any) => {
                const json = res.data;
                const objects = this.jsonLeaguesToArrayHelper(json.leagues);
                // this.setCacheItem(cacheName, JSON.stringify(json.leagues), this.getExpireDate('League'));
                return objects;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    jsonLeaguesToArrayHelper(jsonArray: any): League[] {
        const leagues: League[] = [];
        for (const json of jsonArray) {
            const object = this.jsonLeagueToObjectHelper(json);
            leagues.push(object);
        }
        return leagues;
    }

    jsonLeagueToObjectHelper(json: any): League {
        // identifier: "8e7fa444c4b60383727fb61fcc6aa387",
        // league_slug: "bundesliga",
        // name: "Bundesliga",
        // nation: "Germany",
        // level: "1"
        // cup: false,
        // federation: "UEFA"
        const league = new League(json.name);
        league.setId(json.league_slug);
        league.setAbbreviation(league.getName().substr(0, League.MAX_LENGTH_ABBREVIATION));
        // this.setAsspociationByLeagueId(league.getId(), this.jsonAssociationToObjectHelper(json));

        return league;
    }

    protected handleError(error: HttpErrorResponse): Observable<any> {
        let errortext = 'onbekende fout';
        console.error(error);
        if (typeof error.error === 'string') {
            errortext = error.error;
        } else if (error.statusText !== undefined) {
            errortext = error.statusText;
        }
        return observableThrowError(errortext);
    }
}
