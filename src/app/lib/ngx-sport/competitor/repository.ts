import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../repository';
import { CompetitorMapper, Competitor, JsonCompetitor, Association } from 'ngx-sport';

@Injectable()
export class CompetitorRepository extends APIRepository {

    constructor(
        private mapper: CompetitorMapper, private http: HttpClient) {
        super();
    }

    getUrlpostfix(): string {
        return 'competitors';
    }

    getUrl(id?: string | number): string {
        return super.getApiUrl() + 'voetbal/competitors' + (id ? ('/' + id) : '');
    }

    getObject(id: string | number, association: Association): Observable<Competitor> {
        return this.http.get(this.getUrl(id), this.getOptions()).pipe(
            map((json: JsonCompetitor) => this.mapper.toObject(json, association)),
            catchError((err) => this.handleError(err))
        );
    }
}
