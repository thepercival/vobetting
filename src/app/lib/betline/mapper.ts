import { Injectable } from '@angular/core';
import { Game, JsonPlace, PlaceMapper } from 'ngx-sport';

import { BetLine } from '../betline';
import { JsonLayBack, LayBackMapper } from '../layback/mapper';

@Injectable()
export class BetLineMapper {

    constructor(private placeMapper: PlaceMapper, private layBackMapper: LayBackMapper) { }

    toObject(json: JsonBetLine, game: Game, betLine?: BetLine): BetLine {
        if (betLine === undefined) {
            betLine = new BetLine(game, json.betType);
        }
        betLine.setId(json.id);
        if (json.place !== undefined) {
            betLine.setPlace(game.getPoule().getPlace(json.place.number));
        }
        json.layBacks.map(jsonLayBack => this.layBackMapper.toObject(jsonLayBack, betLine));
        return betLine;
    }

    toJson(betLine: BetLine): JsonBetLine {
        return {
            id: betLine.getId(),
            betType: betLine.getBetType(),
            place: betLine.getPlace() ? this.placeMapper.toJson(betLine.getPlace()) : undefined
        };
    }
}

export interface JsonBetLine {
    id?: number;
    betType: number;
    place?: JsonPlace;
    layBacks?: JsonLayBack[]
}
