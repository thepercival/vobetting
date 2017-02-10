/**
 * Created by cdunnink on 7-2-2017.
 */

export class ExternalSystem{
    protected id: number;
    protected name: string;
    protected website: string;

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
}