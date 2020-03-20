import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { APIRepository } from '../repository';
import { AssociationMapper, Association, JsonAssociation, JsonSport, Sport, SportMapper } from 'ngx-sport';
import { ExternalSource } from './source';

@Injectable()
export class ExternalObjectRepository extends APIRepository {

    private url: string;

    constructor(
        private http: HttpClient,
        private associationMapper: AssociationMapper,
        private sportMapper: SportMapper) {
        super();
        this.url = super.getApiUrl() + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'externalsources';
    }

    protected getUrl(externalSource: ExternalSource, objectType: string): string {
        return this.url + '/' + externalSource.getId() + '/' + objectType;
    }

    getAssociations(externalSource: ExternalSource): Observable<Association[]> {
        const url = this.getUrl(externalSource, 'associations')
        return this.http.get(url, this.getOptions()).pipe(
            map((json: JsonAssociation[]) => {
                return json.map(jsonAssociation => this.associationMapper.toObject(jsonAssociation));
            }),
            catchError((err) => this.handleError(err))
        );
    }

    getSports(externalSource: ExternalSource): Observable<Sport[]> {
        const url = this.getUrl(externalSource, 'sports')
        return this.http.get(url, this.getOptions()).pipe(
            map((json: JsonSport[]) => {
                return json.map(jsonSport => this.sportMapper.toObject(jsonSport));
            }),
            catchError((err) => this.handleError(err))
        );
    }
}


