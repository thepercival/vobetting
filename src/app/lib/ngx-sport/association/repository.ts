import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../repository';
import { AssociationMapper, Association } from 'ngx-sport';

@Injectable()
export class AssociationRepository extends APIRepository {

    constructor(
        private mapper: AssociationMapper, private http: HttpClient) {
        super();
    }

    getUrlpostfix(): string {
        return 'associations';
    }

    getUrl(association: Association): string {
        return super.getApiUrl() + 'associations/' + association.getId() + '/' + this.getUrlpostfix();
    }
    /*
        createObject(json: JsonCompetition, league: League, season: Season): Observable<Competition> {
            const association = tournament.getCompetition().getLeague().getAssociation();
            return this.http.post(this.getUrl(tournament), json, this.getOptions()).pipe(
                map((jsonCompetitor: JsonCompetitor) => this.mapper.toObject(jsonCompetitor, association)),
                catchError((err) => this.handleError(err))
            );
        }

        editObject(competitor: Competitor, tournament: Tournament): Observable<Competitor> {
            const url = this.getUrl(tournament) + '/' + competitor.getId();
            const association = tournament.getCompetition().getLeague().getAssociation();
            return this.http.put(url, this.mapper.toJson(competitor), this.getOptions()).pipe(
                map((jsonCompetitor: JsonCompetitor) => this.mapper.toObject(jsonCompetitor, association, competitor)),
                catchError((err) => this.handleError(err))
            );
        }*/

}
