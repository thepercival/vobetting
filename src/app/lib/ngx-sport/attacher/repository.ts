import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../repository';
import { AssociationMapper, Association, JsonAssociation, AttacherMapper, ExternalSource, JsonAttacher } from 'ngx-sport';

@Injectable()
export class AttacherRepository extends APIRepository {

    constructor(
        private mapper: AttacherMapper, private http: HttpClient) {
        super();
    }

    getUrl(): string {
        return super.getApiUrl() + 'voetbal/attachers';
    }

    // getObjects(externalSource: ExternalSource, objectType: number): Observable<Association[]> {
    //     return this.http.get(this.getUrl(), this.getOptions()).pipe(
    //         map((json: JsonAttacher[]) => json.map(jsonAttacher => this.mapper.toObject(jsonAttacher, externalSource))),
    //         catchError((err) => this.handleError(err))
    //     );
    // }

    // createObject(json: JsonAssociation): Observable<Association> {
    //     return this.http.post(this.getUrl(), json, this.getOptions()).pipe(
    //         map((jsonAssociation: JsonAssociation) => this.mapper.toObject(jsonAssociation)),
    //         catchError((err) => this.handleError(err))
    //     );
    // }

    // removeObject(association: Association): Observable<Association> {
    //     return this.http.delete(this.getUrl(association), { headers: super.getHeaders() }).pipe(
    //         map((res: Association) => res),
    //         catchError((err) => this.handleError(err))
    //     );
    // }

}
