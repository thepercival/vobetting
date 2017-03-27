/**
 * Created by coen on 22-3-17.
 */

import { Injectable } from '@angular/core';
import { CompetitionSeason } from '../competitionseason';
import { Round } from '../round';
import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { Game } from '../game';

@Injectable()
export class StructureService {

    constructor( private competitionseason: CompetitionSeason, private rounds : Round[] )
    {

    }

    getCompetitionSeason(): CompetitionSeason
    {
        return this.competitionseason;
    }

    getPoulePlaces(): PoulePlace[]
    {
        let pouleplaces = [];
        this.rounds.forEach( function( round ){
            round.getPoules().forEach( function( poule ){
                poule.getPlaces().forEach( function( pouleplace ){
                    pouleplaces.push(pouleplace);
                });
            });
        });
        return pouleplaces;
    }

    getGames(): Game[]
    {
        let games = [];
        this.rounds.forEach( function( round ) {
            round.getGames().forEach(function (game) {
                games.push(game);
            });
        });
        return games;
    }
}