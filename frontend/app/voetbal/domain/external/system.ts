/**
 * Created by cdunnink on 7-2-2017.
 */

export abstract class ExternalSystem{
    protected id: number;
    protected name: string;
    protected website: string;
    protected username: string;
    protected password: string;
    protected apiurl: string;
    protected apikey: string;

    static readonly MAX_LENGTH_NAME = 50;
    static readonly MAX_LENGTH_WEBSITE = 255;
    static readonly MAX_LENGTH_USERNAME = 50;
    static readonly MAX_LENGTH_PASSWORD = 50;
    static readonly MAX_LENGTH_APIURL = 255;
    static readonly MAX_LENGTH_APIKEY = 255;

    // constructor
    constructor( name: string ){
        this.setName(name);
    }

    getId(): number {
        return this.id;
    };

    setId( id: number): void {
        this.id = id;
    };

    getName(): string {
        return this.name;
    };

    setName(name: string): void {
        this.name = name;
    };

    getWebsite(): string {
        return this.website;
    };

    setWebsite(website: string): void {
        this.website = website;
    };

    getUsername(): string {
        return this.username;
    };

    setUsername(username: string): void {
        this.username = username;
    };

    getPassword(): string {
        return this.password;
    };

    setPassword(password: string): void {
        this.password = password;
    };

    getApiurl(): string {
        return this.apiurl;
    };

    setApiurl(apiurl: string): void {
        this.apiurl = apiurl;
    };

    getApikey(): string {
        return this.apikey;
    };

    setApikey(apikey: string): void {
        this.apikey = apikey;
    };

    abstract hasAvailableExportClass( exportClass: string ): boolean;
}