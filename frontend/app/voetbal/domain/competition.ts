/**
 * Created by coen on 10-2-17.
 */

export class Competition {
    protected id: number;
    protected name: string;
    protected abbreviation: string;

    static readonly classname = "Competition";

    static readonly MIN_LENGTH_NAME = 3;
    static readonly MAX_LENGTH_NAME = 30;
    static readonly MAX_LENGTH_ABBREVIATION = 7;

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

    getAbbreviation(): string {
        return this.abbreviation;
    };

    setAbbreviation(abbreviation: string): void {
        this.abbreviation = abbreviation;
    };
}