/**
 * Created by coen on 11-2-17.
 */

export class Season {
    protected id: number;
    protected name: string;
    protected startdate: Date;
    protected enddate: Date;

    static classname = "Season";

    static readonly MIN_LENGTH_NAME = 2;
    static readonly MAX_LENGTH_NAME = 9;

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

    getStartdate(): Date {
        return this.startdate;
    };

    setStartdate(startdate: Date): void {
        this.startdate = startdate;
    };

    getEnddate(): Date {
        return this.enddate;
    };

    setEnddate(enddate: Date): void {
        this.enddate = enddate;
    };
}