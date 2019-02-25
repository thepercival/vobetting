import { Injectable } from '@angular/core';
import { ExternalSystemMapper, JsonExternalSystem } from 'ngx-sport';

import { BetLine } from '../betline';
import { LayBack } from '../layback';

@Injectable()
export class LayBackMapper {

    constructor(private externalSystemMapper: ExternalSystemMapper) { }

    toObject(json: JsonLayBack, betLine: BetLine, layBack?: LayBack): LayBack {
        if (layBack === undefined) {
            layBack = new LayBack(new Date(json.dateTime), betLine);
        }
        layBack.setId(json.id);
        layBack.setBack(json.back);
        layBack.setPrice(json.price);
        layBack.setSize(json.size);
        if (json.externalSystem !== undefined) {
            layBack.setExternalSystem(this.externalSystemMapper.toObject(json.externalSystem));
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
            externalSystem: layBack.getExternalSystem() ?
                this.externalSystemMapper.toJson(layBack.getExternalSystem()) : undefined
        };
    }
}

export interface JsonLayBack {
    id?: number;
    dateTime: string;
    back: boolean;
    price: number;
    size: number;
    externalSystem?: JsonExternalSystem;
}