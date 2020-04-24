
import { BetLine } from './betline';
import { Game } from 'ngx-sport';

export class BettingNameService {
    constructor() {
    }

    getBetTypeDescription(betType: number): string {
        if (betType === BetLine.MATCH_ODDS) {
            return 'resultaat';
        }
        return 'onbekend';
    }

    getRunnerDescription(betType: number, runner: boolean): string {
        if (betType === BetLine.MATCH_ODDS) {
            return runner === Game.HOME ? 'thuis' : (runner === Game.AWAY ? 'uit' : 'gelijk');
        }
        return 'onbekend';
    }
}
