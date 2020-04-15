import { Attacher } from '../attacher';
import { Association, Sport, Season, League, Competition, Competitor } from 'ngx-sport';

export class ExternalSource {
    static readonly MAX_LENGTH_NAME = 50;
    static readonly MAX_LENGTH_WEBSITE = 255;
    static readonly MAX_LENGTH_USERNAME = 50;
    static readonly MAX_LENGTH_PASSWORD = 50;
    static readonly MAX_LENGTH_APIURL = 255;
    static readonly MAX_LENGTH_APIKEY = 255;

    static readonly SPORT = 1;
    static readonly ASSOCIATION = 2;
    static readonly SEASON = 4;
    static readonly LEAGUE = 8;
    static readonly COMPETITION = 16;
    static readonly COMPETITOR = 32;

    protected id: number;
    protected name: string;
    protected website: string;
    protected username: string;
    protected password: string;
    protected apiurl: string;
    protected apikey: string;
    protected implementations: number;

    protected associationAttachers: Attacher[] = [];
    protected sportAttachers: Attacher[] = [];
    protected seasonAttachers: Attacher[] = [];
    protected leagueAttachers: Attacher[] = [];
    protected competitionAttachers: Attacher[] = [];
    protected competitorAttachers: Attacher[] = [];

    constructor(name: string) {
        this.setName(name);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getWebsite(): string {
        return this.website;
    }

    setWebsite(website: string): void {
        this.website = website;
    }

    getUsername(): string {
        return this.username;
    }

    setUsername(username: string): void {
        this.username = username;
    }

    getPassword(): string {
        return this.password;
    }

    setPassword(password: string): void {
        this.password = password;
    }

    getApiurl(): string {
        return this.apiurl;
    }

    setApiurl(apiurl: string): void {
        this.apiurl = apiurl;
    }

    getApikey(): string {
        return this.apikey;
    }

    setApikey(apikey: string): void {
        this.apikey = apikey;
    }

    getImplementations(): number {
        return this.implementations;
    }

    setImplementations(implementations: number) {
        this.implementations = implementations;
    }

    hasAssociationImplementation(): boolean {
        // tslint:disable-next-line:no-bitwise
        return (this.implementations & ExternalSource.ASSOCIATION) > 0;
    }

    addAssociationAttacher(attacher: Attacher) {
        this.associationAttachers.push(attacher);
    }

    getAssociationAttacher(association: Association): Attacher {
        return this.associationAttachers.find(attacher => attacher.getImportableId() === association.getId());
    }

    hasSportImplementation(): boolean {
        // tslint:disable-next-line:no-bitwise
        return (this.implementations & ExternalSource.SPORT) > 0;
    }

    addSportAttacher(attacher: Attacher) {
        this.sportAttachers.push(attacher);
    }

    getSportAttacher(sport: Sport): Attacher {
        return this.sportAttachers.find(attacher => attacher.getImportableId() === sport.getId());
    }

    hasSeasonImplementation(): boolean {
        // tslint:disable-next-line:no-bitwise
        return (this.implementations & ExternalSource.SEASON) > 0;
    }

    addSeasonAttacher(attacher: Attacher) {
        this.seasonAttachers.push(attacher);
    }

    getSeasonAttacher(season: Season): Attacher {
        return this.seasonAttachers.find(attacher => attacher.getImportableId() === season.getId());
    }

    hasLeagueImplementation(): boolean {
        // tslint:disable-next-line:no-bitwise
        return (this.implementations & ExternalSource.LEAGUE) > 0;
    }

    addLeagueAttacher(attacher: Attacher) {
        this.leagueAttachers.push(attacher);
    }

    getLeagueAttacher(league: League): Attacher {
        return this.leagueAttachers.find(attacher => attacher.getImportableId() === league.getId());
    }

    hasCompetitionImplementation(): boolean {
        // tslint:disable-next-line:no-bitwise
        return (this.implementations & ExternalSource.COMPETITION) > 0;
    }

    addCompetitionAttacher(attacher: Attacher) {
        this.competitionAttachers.push(attacher);
    }

    getCompetitionAttacher(competition: Competition): Attacher {
        return this.competitionAttachers.find(attacher => attacher.getImportableId() === competition.getId());
    }

    hasCompetitorImplementation(): boolean {
        // tslint:disable-next-line:no-bitwise
        return (this.implementations & ExternalSource.COMPETITOR) > 0;
    }

    addCompetitorAttacher(attacher: Attacher) {
        this.competitorAttachers.push(attacher);
    }

    getCompetitorAttacher(competitor: Competitor): Attacher {
        return this.competitorAttachers.find(attacher => attacher.getImportableId() === competitor.getId());
    }
}
