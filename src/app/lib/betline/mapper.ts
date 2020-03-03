import { Injectable } from '@angular/core';
import { Game, JsonPlace, PlaceMapper } from 'ngx-sport';

import { BetLine } from '../betline';

@Injectable()
export class BetLineMapper {

    constructor(private placeMapper: PlaceMapper) { }

    toObject(json: JsonBetLine, game: Game, betLine?: BetLine): BetLine {
        if (betLine === undefined) {
            betLine = new BetLine(game, json.betType);
        }
        betLine.setId(json.id);
        if (json.poulePlace !== undefined) {
            betLine.setPoulePlace(game.getPoule().getPlace(json.poulePlace.number));
        }
        return betLine;
    }

    toJson(betLine: BetLine): JsonBetLine {
        return {
            id: betLine.getId(),
            betType: betLine.getBetType(),
            poulePlace: betLine.getPoulePlace() ? this.placeMapper.toJson(betLine.getPoulePlace()) : undefined
        };
    }
}

export interface JsonBetLine {
    id?: number;
    betType: number;
    poulePlace?: JsonPlace;
}
