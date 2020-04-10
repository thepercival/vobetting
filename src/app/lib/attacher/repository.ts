import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../repository';
import { AssociationMapper, Association, JsonAssociation } from 'ngx-sport';
import { AttacherMapper, JsonAttacher } from './mapper';
import { ExternalSource } from '../external/source';
import { Attacher } from '../attacher';

@Injectable()
export class AttacherRepository extends APIRepository {

    constructor(
        private mapper: AttacherMapper, private http: HttpClient) {
        super();
    }

    getUrl(externalSource: ExternalSource, objecType: string, id?: any): string {
        const url = super.getApiUrl() + 'attachers/' + externalSource.getId() + '/' + objecType;
        return id ? (url + '/' + id) : url;
    }

    getSports(externalSource: ExternalSource): Observable<Attacher[]> {
        return this.http.get(this.getUrl(externalSource, 'sports'), this.getOptions()).pipe(
            map((json: JsonAttacher[]) => json.map(jsonAttacher => this.mapper.toObject(jsonAttacher, externalSource))),
            catchError((err) => this.handleError(err))
        );
    }

    getAssociations(externalSource: ExternalSource): Observable<Attacher[]> {
        return this.http.get(this.getUrl(externalSource, 'associations'), this.getOptions()).pipe(
            map((json: JsonAttacher[]) => json.map(jsonAttacher => this.mapper.toObject(jsonAttacher, externalSource))),
            catchError((err) => this.handleError(err))
        );
    }

    getSeasons(externalSource: ExternalSource): Observable<Attacher[]> {
        return this.http.get(this.getUrl(externalSource, 'seasons'), this.getOptions()).pipe(
            map((json: JsonAttacher[]) => json.map(jsonAttacher => this.mapper.toObject(jsonAttacher, externalSource))),
            catchError((err) => this.handleError(err))
        );
    }

    getLeagues(externalSource: ExternalSource): Observable<Attacher[]> {
        return this.http.get(this.getUrl(externalSource, 'leagues'), this.getOptions()).pipe(
            map((json: JsonAttacher[]) => json.map(jsonAttacher => this.mapper.toObject(jsonAttacher, externalSource))),
            catchError((err) => this.handleError(err))
        );
    }

    // createObject(json: JsonAssociation): Observable<Association> {
    //     return this.http.post(this.getUrl(), json, this.getOptions()).pipe(
    //         map((jsonAssociation: JsonAssociation) => this.mapper.toObject(jsonAssociation)),
    //         catchError((err) => this.handleError(err))
    //     );
    // }

    createSport(json: JsonAttacher, externalSource: ExternalSource): Observable<Attacher> {
        const url = this.getUrl(externalSource, 'sports');
        return this.http.post(url, json, this.getOptions()).pipe(
            map((jsonAttacher: JsonAttacher) => this.mapper.toObject(jsonAttacher, externalSource)),
            catchError((err) => this.handleError(err))
        );
    }

    createAssociation(json: JsonAttacher, externalSource: ExternalSource): Observable<Attacher> {
        const url = this.getUrl(externalSource, 'associations');
        return this.http.post(url, json, this.getOptions()).pipe(
            map((jsonAttacher: JsonAttacher) => this.mapper.toObject(jsonAttacher, externalSource)),
            catchError((err) => this.handleError(err))
        );
    }

    createSeason(json: JsonAttacher, externalSource: ExternalSource): Observable<Attacher> {
        const url = this.getUrl(externalSource, 'seasons');
        return this.http.post(url, json, this.getOptions()).pipe(
            map((jsonAttacher: JsonAttacher) => this.mapper.toObject(jsonAttacher, externalSource)),
            catchError((err) => this.handleError(err))
        );
    }

    createLeague(json: JsonAttacher, externalSource: ExternalSource): Observable<Attacher> {
        const url = this.getUrl(externalSource, 'seasons');
        return this.http.post(url, json, this.getOptions()).pipe(
            map((jsonAttacher: JsonAttacher) => this.mapper.toObject(jsonAttacher, externalSource)),
            catchError((err) => this.handleError(err))
        );
    }

    removeSport(attacher: Attacher): Observable<void> {
        const url = this.getUrl(attacher.getExternalSource(), 'sports', attacher.getId());
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            catchError((err) => this.handleError(err))
        );
    }

    removeAssociation(attacher: Attacher): Observable<void> {
        const url = this.getUrl(attacher.getExternalSource(), 'associations', attacher.getId());
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            catchError((err) => this.handleError(err))
        );
    }

    removeSeason(attacher: Attacher): Observable<void> {
        const url = this.getUrl(attacher.getExternalSource(), 'seasons', attacher.getId());
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            catchError((err) => this.handleError(err))
        );
    }

    removeLeague(attacher: Attacher): Observable<void> {
        const url = this.getUrl(attacher.getExternalSource(), 'leagues', attacher.getId());
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            catchError((err) => this.handleError(err))
        );
    }

}
