/**
 * Created by coen on 30-1-17.
 */

export class Association{
    protected id: number;
    protected name: string;
    protected description: string;
    protected parent: Association;

    static classname = "Association";

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

    getDescription(): string {
        return this.description;
    };

    setDescription(description: string): void {
        this.description = description;
    };

    getParent(): Association {
        return this.parent;
    };

    setParent(parent: Association): void {
        this.parent = parent;
    };
}