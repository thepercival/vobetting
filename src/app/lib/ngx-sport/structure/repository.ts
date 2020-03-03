import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { StructureMapper, Structure, JsonStructure, Competition } from 'ngx-sport';
import { APIRepository } from '../../repository';

@Injectable()
export class StructureRepository extends APIRepository {

    constructor(
        private mapper: StructureMapper,
        private http: HttpClient) {
        super();
    }

    getUrlpostfix(): string {
        return 'structure';
    }

    getUrl(competition: Competition): string {
        const prefix = this.getToken() ? '' : 'public/';
        return super.getApiUrl() + prefix + 'tournaments/' + competition.getId() + '/' + this.getUrlpostfix();
    }

    getObject(competition: Competition): Observable<Structure> {
        return this.http.get(this.getUrl(competition), this.getOptions()).pipe(
            map((json: JsonStructure) => this.mapper.toObject(json, competition)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(structure: Structure, competition: Competition): Observable<Structure> {
        return this.http.put(this.getUrl(competition), this.mapper.toJson(structure), this.getOptions()).pipe(
            map((jsonRes: JsonStructure) => this.mapper.toObject(jsonRes, competition)),
            catchError((err) => this.handleError(err))
        );
    }
}
