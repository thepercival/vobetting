/**
 * Created by coen on 30-1-17.
 */
import {VoetbalInterface} from './interface';

export class Association implements VoetbalInterface{
    protected id: number;
    protected name: string;
    protected description: string;
    protected parent: Association;

    // constructor
    constructor(
        name: string
    ){
        this.name = name;
    }

    getId(): number {
        return this.id;
    };

    getName(): string {
        return this.name;
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