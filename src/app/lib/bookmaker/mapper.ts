import { Injectable } from '@angular/core';

import { Bookmaker } from '../bookmaker';

@Injectable()
export class BookmakerMapper {
    constructor() { }

    toObject(json: JsonBookmaker, bookmaker?: Bookmaker): Bookmaker {
        if (bookmaker === undefined) {
            bookmaker = new Bookmaker(json.name);
            bookmaker.setId(json.id);
            bookmaker.setExchange(json.exchange);
            bookmaker.setFeePercentage(json.feePercentage);
            return bookmaker;
        }
    }

    toJson(bookmaker: Bookmaker): JsonBookmaker {
        return {
            name: bookmaker.getName(),
            exchange: bookmaker.getExchange(),
            feePercentage: bookmaker.getFeePercentage()
        };
    }
}

export interface JsonBookmaker {
    id?: string | number;
    name: string;
    exchange: boolean;
    feePercentage: number
}
