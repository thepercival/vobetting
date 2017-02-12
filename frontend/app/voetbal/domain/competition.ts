/**
 * Created by coen on 10-2-17.
 */


export class Competition {
    protected id: number;
    protected name: string;

    static classname = "Competition";

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
}