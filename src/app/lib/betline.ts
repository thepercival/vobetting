import { Game, Place } from 'ngx-sport';

import { LayBack } from './layback';

/**
 * Created by coen on 9-10-17.
 */
export class BetLine {
    static readonly MATCH_ODDS = 1;

    protected id: number;
    protected betType: number;
    protected game: Game;
    protected poulePlace: Place;
    protected layBacks: LayBack[] = [];

    // constructor
    constructor(game: Game, betType) {
        this.setGame(game);
        this.setBetType(betType);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getBetType(): number {
        return this.betType;
    }

    setBetType(betType: number): void {
        this.betType = betType;
    }

    getGame(): Game {
        return this.game;
    }

    setGame(game: Game): void {
        this.game = game;
    }

    getPoulePlace(): Place {
        return this.poulePlace;
    }

    setPoulePlace(poulePlace: Place): void {
        this.poulePlace = poulePlace;
    }

    getLayBacks(): LayBack[] {
        return this.layBacks;
    }

    // setRoles(roles: TournamentRole[]): void {
    //     this.roles = roles;
    // }
}
