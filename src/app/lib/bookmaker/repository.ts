import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../repository';
import { BookmakerMapper, JsonBookmaker } from './mapper';
import { Bookmaker } from '../bookmaker';

@Injectable()
export class BookmakerRepository extends APIRepository {

    constructor(
        private mapper: BookmakerMapper, private http: HttpClient) {
        super();
    }

    getUrl(id?: string | number): string {
        return super.getApiUrl() + 'bookmakers' + (id ? ('/' + id) : '');
    }

    getObject(id: any): Observable<Bookmaker> {
        return this.http.get(this.getUrl(id), this.getOptions()).pipe(
            map((json: JsonBookmaker) => this.mapper.toObject(json)),
            catchError((err) => this.handleError(err))
        );
    }

    getObjects(): Observable<Bookmaker[]> {
        return this.http.get(this.getUrl(), this.getOptions()).pipe(
            map((json: JsonBookmaker[]) => json.map(jsonBookmaker => this.mapper.toObject(jsonBookmaker))),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(json: JsonBookmaker): Observable<Bookmaker> {
        return this.http.post(this.getUrl(), json, this.getOptions()).pipe(
            map((jsonBookmaker: JsonBookmaker) => this.mapper.toObject(jsonBookmaker)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(bookmaker: Bookmaker): Observable<Bookmaker> {
        const url = this.getUrl(bookmaker.getId());
        return this.http.put(url, this.mapper.toJson(bookmaker), this.getOptions()).pipe(
            map((jsonBookmaker: JsonBookmaker) => this.mapper.toObject(jsonBookmaker, bookmaker)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(bookmaker: Bookmaker): Observable<Bookmaker> {
        return this.http.delete(this.getUrl(bookmaker.getId()), { headers: super.getHeaders() }).pipe(
            map((res: Bookmaker) => res),
            catchError((err) => this.handleError(err))
        );
    }

}
