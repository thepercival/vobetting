import { Injectable } from '@angular/core';
import { Game, JsonPlace, PlaceMapper } from 'ngx-sport';

import { BetLine } from '../betline';
import { JsonLayBack, LayBackMapper } from '../layback/mapper';
import { LayBack } from '../layback';

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
        // const jsonLayBacks = this.test(json.layBacks);
        const jsonLayBacks = json.layBacks;
        jsonLayBacks.map(jsonLayBack => this.layBackMapper.toObject(jsonLayBack, betLine));
        return betLine;
    }

    // protected test(layBacks: JsonLayBack[]): JsonLayBack[] {
    //     const ret = [];
    //     const backDates = {};
    //     const layDates = {};
    //     layBacks.forEach(layBack => {
    //         if (layBack.back === LayBack.BACK) {
    //             if (backDates[layBack.dateTime] !== undefined) {
    //                 return;
    //             }
    //             backDates[layBack.dateTime] = true;
    //         }
    //         if (layBack.back === LayBack.LAY) {
    //             if (layDates[layBack.dateTime] !== undefined) {
    //                 return;
    //             }
    //             layDates[layBack.dateTime] = true;
    //         }
    //         ret.push(layBack);
    //     });
    //     return ret;
    // }

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
