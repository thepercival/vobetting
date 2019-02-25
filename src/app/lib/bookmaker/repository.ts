import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SportRepository } from 'ngx-sport';
import { Observable } from 'rxjs';
import { catchError ,  map } from 'rxjs/operators';

import { Bookmaker } from '../bookmaker';

@Injectable()
export class BookmakerRepository extends SportRepository {

    private url: string;

    constructor(private http: HttpClient,
        router: Router
    ) {
        super(router);
        this.url = super.getApiUrl() + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'bookmakers';
    }

    getObjects(): Observable<Bookmaker[]> {
        const options = {
            headers: super.getHeaders()
        };
        return this.http.get(this.url, options).pipe(
            map((res: IBookmaker[]) => this.jsonArrayToObject(res)),
            catchError((err) => this.handleError(err))
        );
    }

    getObject(id: number): Observable<Bookmaker> {
        const url = this.url + '/' + id;
        return this.http.get(url, { headers: super.getHeaders() }).pipe(
            map((res: IBookmaker) => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(json: IBookmaker): Observable<Bookmaker> {
        return this.http.post(this.url, json, { headers: super.getHeaders() }).pipe(
            map((res: IBookmaker) => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(bookmaker: Bookmaker): Observable<Bookmaker> {
        const url = this.url + '/' + bookmaker.getId();
        return this.http.put(url, this.objectToJsonHelper(bookmaker), { headers: super.getHeaders() }).pipe(
            map((res: IBookmaker) => this.jsonToObjectHelper(res, bookmaker)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(object: Bookmaker): Observable<Bookmaker> {
        const url = this.url + '/' + object.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((res: Bookmaker) => res),
            catchError((err) => this.handleError(err))
        );
    }

    jsonArrayToObject(jsonArray: IBookmaker[]): Bookmaker[] {
        const bookmakers: Bookmaker[] = [];
        for (const json of jsonArray) {
            bookmakers.push(this.jsonToObjectHelper(json));
        }
        return bookmakers;
    }

    jsonToObjectHelper(json: IBookmaker, bookmaker?: Bookmaker): Bookmaker {
        if (bookmaker === undefined) {
            bookmaker = new Bookmaker();
        }
        bookmaker.setId(json.id);
        bookmaker.setName(json.name);
        bookmaker.setExchange(json.exchange);
        return bookmaker;
    }

    objectToJsonHelper(object: Bookmaker): IBookmaker {
        const json: IBookmaker = {
            id: object.getId(),
            name: object.getName(),
            exchange: object.getExchange()
        };
        return json;
    }
}

export interface IBookmaker {
    id?: number;
    name: string;
    exchange: boolean;
}
