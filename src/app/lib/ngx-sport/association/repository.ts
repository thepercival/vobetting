import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../repository';
import { AssociationMapper, Association, JsonAssociation } from 'ngx-sport';

@Injectable()
export class AssociationRepository extends APIRepository {

    constructor(
        private mapper: AssociationMapper, private http: HttpClient) {
        super();
    }

    getUrl(id?: string | number): string {
        return super.getApiUrl() + 'voetbal/associations' + (id ? ('/' + id) : '');
    }

    getObject(id: any): Observable<Association> {
        return this.http.get(this.getUrl(id), this.getOptions()).pipe(
            map((json: JsonAssociation) => this.mapper.toObject(json)),
            catchError((err) => this.handleError(err))
        );
    }

    getObjects(): Observable<Association[]> {
        return this.http.get(this.getUrl(), this.getOptions()).pipe(
            map((json: JsonAssociation[]) => json.map(jsonAssociation => this.mapper.toObject(jsonAssociation))),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(json: JsonAssociation): Observable<Association> {
        return this.http.post(this.getUrl(), json, this.getOptions()).pipe(
            map((jsonAssociation: JsonAssociation) => this.mapper.toObject(jsonAssociation)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(association: Association): Observable<Association> {
        const url = this.getUrl(association.getId());
        return this.http.put(url, this.mapper.toJson(association), this.getOptions()).pipe(
            map((jsonAssociation: JsonAssociation) => this.mapper.toObject(jsonAssociation, association)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(association: Association): Observable<Association> {
        return this.http.delete(this.getUrl(association.getId()), { headers: super.getHeaders() }).pipe(
            map((res: Association) => res),
            catchError((err) => this.handleError(err))
        );
    }
}
