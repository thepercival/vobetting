/**
 * Created by coen on 27-2-17.
 */

import { CompetitionSeason } from './competitionseason';
import { Poule } from './poule';
import { Team } from './team';
import { Game } from './game';

export class Round {
    protected id: number;
    protected competitionseason: CompetitionSeason;
    protected number: number;
    protected nrofheadtoheadmatches: number;
    protected name: string;
    protected poules: Poule[] = [];

    static readonly classname = "Round";

    // constructor
    constructor( competitionseason: CompetitionSeason, number: number ){
        this.setCompetitionSeason(competitionseason);
        this.setNumber(number);
    }

    getId(): number {
        return this.id;
    };

    setId( id: number): void {
        this.id = id;
    };

    getCompetitionSeason(): CompetitionSeason {
        return this.competitionseason;
    };

    setCompetitionSeason( competitionseason: CompetitionSeason): void {
        this.competitionseason = competitionseason;
    };

    getNumber(): number {
        return this.number;
    };

    setNumber( number: number): void {
        this.number = number;
    };

    getNrofheadtoheadmatches(): number {
        return this.nrofheadtoheadmatches;
    };

    setNrofheadtoheadmatches( nrofheadtoheadmatches: number): void {
        this.nrofheadtoheadmatches = nrofheadtoheadmatches;
    };

    getName(): string {
        return this.name;
    };

    setName(name: string): void {
        this.name = name;
    };

    getPoules(): Poule[] {
        return this.poules;
    }

    getTeams(): Team[]{
        let teams: Team[] = [];
        for( let poule of this.getPoules() ){
            let pouleTeams = poule.getTeams();
            for( let pouleTeam of pouleTeams ){
                teams.push(pouleTeam);
            }
        }
        return teams;
    }

    getGames(): Game[]
    {
        let games = [];
        this.getPoules().forEach( function( poule ){
            poule.getGames().forEach( function( game ){
                games.push(game);
            });
        });
        return games;
    }
}
