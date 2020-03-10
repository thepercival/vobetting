import { Injectable } from '@angular/core';
import { ExternalSourceMapper, JsonExternalSource } from 'ngx-sport';

import { BetLine } from '../betline';
import { LayBack } from '../layback';

@Injectable()
export class LayBackMapper {

    constructor(private externalSourceMapper: ExternalSourceMapper) { }

    toObject(json: JsonLayBack, betLine: BetLine, layBack?: LayBack): LayBack {
        if (layBack === undefined) {
            layBack = new LayBack(new Date(json.dateTime), betLine);
        }
        layBack.setId(json.id);
        layBack.setBack(json.back);
        layBack.setPrice(json.price);
        layBack.setSize(json.size);
        if (json.externalSource !== undefined) {
            layBack.setExternalSource(this.externalSourceMapper.toObject(json.externalSource));
        }
        return layBack;
    }

    toJson(layBack: LayBack): JsonLayBack {
        return {
            id: layBack.getId(),
            dateTime: layBack.getDateTime().toISOString(),
            back: layBack.getBack(),
            price: layBack.getPrice(),
            size: layBack.getSize(),
            externalSource: layBack.getExternalSource() ?
                this.externalSourceMapper.toJson(layBack.getExternalSource()) : undefined
        };
    }
}

export interface JsonLayBack {
    id?: number;
    dateTime: string;
    back: boolean;
    price: number;
    size: number;
    externalSource?: JsonExternalSource;
}
