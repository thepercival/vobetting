import { Injectable } from '@angular/core';
import { BetLine } from '../betline';
import { LayBack } from '../layback';
import { BookmakerMapper, JsonBookmaker } from '../bookmaker/mapper';

@Injectable()
export class LayBackMapper {

    constructor(private bookmakerMapper: BookmakerMapper) { }

    toObject(json: JsonLayBack, betLine: BetLine, layBack?: LayBack): LayBack {
        if (layBack === undefined) {
            layBack = new LayBack(
                new Date(json.dateTime),
                betLine,
                this.bookmakerMapper.toObject(json.bookmaker),
                json.runner);
        }
        layBack.setId(json.id);
        layBack.setBack(json.back);
        layBack.setPrice(json.price);
        layBack.setSize(json.size);
        return layBack;
    }

    toJson(layBack: LayBack): JsonLayBack {
        return {
            id: layBack.getId(),
            dateTime: layBack.getDateTime().toISOString(),
            runner: layBack.getRunner(),
            back: layBack.getBack(),
            price: layBack.getPrice(),
            size: layBack.getSize(),
            bookmaker: this.bookmakerMapper.toJson(layBack.getBookmaker())
        };
    }
}

export interface JsonLayBack {
    id?: number;
    dateTime: string;
    runner: boolean;
    back: boolean;
    price: number;
    size: number;
    bookmaker: JsonBookmaker;
}
