import { Attacher } from '../attacher';
import { Association, Sport, Season, League } from 'ngx-sport';

export class ExternalSource {
    static readonly MAX_LENGTH_NAME = 50;
    static readonly MAX_LENGTH_WEBSITE = 255;
    static readonly MAX_LENGTH_USERNAME = 50;
    static readonly MAX_LENGTH_PASSWORD = 50;
    static readonly MAX_LENGTH_APIURL = 255;
    static readonly MAX_LENGTH_APIKEY = 255;

    protected static readonly SPORT = 1;
    protected static readonly ASSOCIATION = 2;
    protected static readonly SEASON = 4;
    protected static readonly LEAGUE = 8;
    protected static readonly COMPETITION = 16;

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
    protected leagueAttachers: Attacher[] = [];
    protected seasonAttachers: Attacher[] = [];

    //     implementations toevoegen aan json def en aan business, in externsource scherm kun je dan aangeven op welke
    // zaken er gekoppeld kan worden met cards, en een card voor basisgegevens wijzigen

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
}
