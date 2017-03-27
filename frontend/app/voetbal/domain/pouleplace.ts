/**
 * Created by coen on 27-2-17.
 */

import { Poule } from './poule';
import { Team } from './team';
import { Game } from './game';

export class PoulePlace {
    protected id: number;
    protected poule: Poule;
    protected number: number;
    protected name: string;
    protected team: Team;

    static readonly classname = "PoulePlace";

    // constructor
    constructor( poule: Poule, number: number ){
        this.setPoule(poule);
        this.setNumber(number);
    }

    getId(): number {
        return this.id;
    };

    setId( id: number): void {
        this.id = id;
    };

    getPoule(): Poule {
        return this.poule;
    };

    setPoule( poule: Poule): void {
        this.poule = poule;
    };

    getNumber(): number {
        return this.number;
    };

    setNumber( number: number): void {
        this.number = number;
    };

    getName(): string {
        return this.name;
    };

    setName(name: string): void {
        this.name = name;
    };

    getTeam(): Team {
        return this.team;
    }

    setTeam( team: Team): void {
        this.team = team;
    };

    getGames(): Game[]{
        return this.getPoule().getGames().filter( (gameIt) => gameIt.getHomePoulePlace() == this || gameIt.getAwayPoulePlace() == this );
    }
}