import { Game, Place } from 'ngx-sport';

import { LayBack } from './layback';

/**
 * Created by coen on 9-10-17.
 */
export class BetLine {
    static readonly MATCH_ODDS = 1;

    protected id: number;
    protected place: Place;
    protected layBacks: LayBack[] = [];

    constructor(protected game: Game, protected betType: number) {
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

    // setBetType(betType: number): void {
    //     this.betType = betType;
    // }

    getGame(): Game {
        return this.game;
    }

    // setGame(game: Game): void {
    //     this.game = game;
    // }

    getPlace(): Place {
        return this.place;
    }

    setPlace(place: Place): void {
        this.place = place;
    }

    getLayBacks(): LayBack[] {
        return this.layBacks;
    }

    // setRoles(roles: TournamentRole[]): void {
    //     this.roles = roles;
    // }

    getDescription(): string {
        if (this.getBetType() === BetLine.MATCH_ODDS) {
            return 'resultaat';
        }
        return 'onbekend';
    }

    getBetTypeOptions(): boolean[] {
        if (this.getBetType() === BetLine.MATCH_ODDS) {
            return [Game.HOME, undefined, Game.AWAY];
        }
        return [];
    }

    getRunnerDescription(runner: boolean): string {
        if (this.getBetType() === BetLine.MATCH_ODDS) {
            return runner === Game.HOME ? 'thuis' : (runner === Game.AWAY ? 'uit' : 'gelijk');
        }
        return 'onbekend';
    }
}
