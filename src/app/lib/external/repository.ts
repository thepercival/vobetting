import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { APIRepository } from '../repository';
import {
    AssociationMapper, Association, JsonAssociation, JsonSport, Sport,
    SportMapper, JsonLeague, JsonSeason, SeasonMapper, LeagueMapper, Season, League,
    CompetitionMapper, Competition, JsonCompetition, Competitor, CompetitorMapper, JsonCompetitor
} from 'ngx-sport';
import { ExternalSource } from './source';
import { Bookmaker } from '../bookmaker';
import { JsonBookmaker, BookmakerMapper } from '../bookmaker/mapper';

@Injectable()
export class ExternalObjectRepository extends APIRepository {

    private url: string;

    constructor(
        private http: HttpClient,
        private sportMapper: SportMapper,
        private associationMapper: AssociationMapper,
        private seasonMapper: SeasonMapper,
        private leagueMapper: LeagueMapper,
        private competitionMapper: CompetitionMapper,
        private competitorMapper: CompetitorMapper,
        private bookmakerMapper: BookmakerMapper
    ) {
        super();
        this.url = super.getApiUrl() + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'externalsources';
    }

    protected getUrl(externalSource: ExternalSource, objectType: string, id?: string | number): string {
        const url = this.url + '/' + externalSource.getId() + '/' + objectType;
        return id ? (url + '/' + id) : url;
    }

    getSports(externalSource: ExternalSource): Observable<Sport[]> {
        const url = this.getUrl(externalSource, 'sports');
        return this.http.get(url, this.getOptions()).pipe(
            map((json: JsonSport[]) => {
                return json.map(jsonSport => this.sportMapper.toObject(jsonSport));
            }),
            catchError((err) => this.handleError(err))
        );
    }

    getAssociations(externalSource: ExternalSource): Observable<Association[]> {
        const url = this.getUrl(externalSource, 'associations');
        return this.http.get(url, this.getOptions()).pipe(
            map((json: JsonAssociation[]) => {
                return json.map(jsonAssociation => this.associationMapper.toObject(jsonAssociation));
            }),
            catchError((err) => this.handleError(err))
        );
    }

    getSeasons(externalSource: ExternalSource): Observable<Season[]> {
        const url = this.getUrl(externalSource, 'seasons');
        return this.http.get(url, this.getOptions()).pipe(
            map((json: JsonSeason[]) => {
                return json.map(jsonSeason => this.seasonMapper.toObject(jsonSeason));
            }),
            catchError((err) => this.handleError(err))
        );
    }

    getLeagues(externalSource: ExternalSource): Observable<League[]> {
        const url = this.getUrl(externalSource, 'leagues');
        return this.http.get(url, this.getOptions()).pipe(
            map((json: JsonLeague[]) => {
                return json.map(jsonLeague => this.leagueMapper.toObject(jsonLeague));
            }),
            catchError((err) => this.handleError(err))
        );
    }

    getCompetitions(externalSource: ExternalSource): Observable<Competition[]> {
        const url = this.getUrl(externalSource, 'competitions');
        return this.http.get(url, this.getOptions()).pipe(
            map((json: JsonCompetition[]) => {
                return json.map(jsonCompetition => this.competitionMapper.toObject(jsonCompetition));
            }),
            catchError((err) => this.handleError(err))
        );
    }

    getCompetition(externalSource: ExternalSource, externalId: string): Observable<Competition> {
        const url = this.getUrl(externalSource, 'competitions', externalId);
        return this.http.get(url, this.getOptions()).pipe(
            map((jsonCompetition: JsonCompetition) => this.competitionMapper.toObject(jsonCompetition)),
            catchError((err) => this.handleError(err))
        );
    }

    getCompetitors(externalSource: ExternalSource, competition: Competition): Observable<Competitor[]> {
        const url = this.url + '/' + externalSource.getId() + '/' + competition.getId() + '/competitors';
        const association = competition.getLeague().getAssociation();
        return this.http.get(url, this.getOptions()).pipe(
            map((json: JsonCompetitor[]) => {
                return json.map(jsonCompetitor => this.competitorMapper.toObject(jsonCompetitor, association));
            }),
            catchError((err) => this.handleError(err))
        );
    }

    getBookmakers(externalSource: ExternalSource): Observable<Bookmaker[]> {
        const url = this.getUrl(externalSource, 'bookmakers');
        return this.http.get(url, this.getOptions()).pipe(
            map((json: JsonBookmaker[]) => {
                return json.map(jsonBookmaker => this.bookmakerMapper.toObject(jsonBookmaker));
            }),
            catchError((err) => this.handleError(err))
        );
    }
}


