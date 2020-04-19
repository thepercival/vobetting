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
            return bookmaker;
        }
    }

    toJson(bookmaker: Bookmaker): JsonBookmaker {
        return {
            name: bookmaker.getName(),
            exchange: bookmaker.getExchange()
        };
    }
}

export interface JsonBookmaker {
    id?: string | number;
    name: string;
    exchange: boolean;
}
