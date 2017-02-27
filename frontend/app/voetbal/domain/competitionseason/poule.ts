/**
 * Created by coen on 27-2-17.
 */

import { Round } from './round';
import { PoulePlace } from './pouleplace';
import { Team } from '../team';

export class Poule {
    protected id: number;
    protected round: Round;
    protected number: number;
    protected name: string;
    protected pouleplaces: PoulePlace[] = [];

    static readonly classname = "Poule";

    // constructor
    constructor( round: Round, number: number ){
        this.setRound(round);
        this.setNumber(number);
    }

    getId(): number {
        return this.id;
    };

    setId( id: number): void {
        this.id = id;
    };

    getRound(): Round {
        return this.round;
    };

    setRound( round: Round): void {
        this.round = round;
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

    getPoulePlaces(): PoulePlace[] {
        return this.pouleplaces;
    }

    getTeams(): Team[]{
        let teams: Team[] = [];
        for( let pouleplace of this.getPoulePlaces() ){
            teams.push(pouleplace.getTeam());
        }
        return teams;
    }
}
