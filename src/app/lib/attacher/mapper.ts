import { Attacher } from '../attacher';
import { Injectable } from '@angular/core';
import { TheCache } from '../cache';

@Injectable()
export class AttacherMapper {

    constructor() { }

    // toObject(json: JsonAttacher, attacher?: Attacher): Attacher {
    //     if (attacher === undefined && json.id !== undefined) {
    //         attacher = TheCache.externals[json.id];
    //     }
    //     if (attacher === undefined) {
    //         attacher = new Attacher(
    //             json.importableObjectId,
    //             json.externalSourceId);
    //         attacher.setId(json.id);
    //         attacher.setExternalId(json.externalId);
    //         TheCache.externals[attacher.getId()] = attacher;
    //     }
    //     return attacher;
    // }

    toJson(attacher: Attacher): JsonAttacher {
        return {
            id: attacher.getId(),
            importableId: attacher.getImportable().getId(),
            externalSourceId: attacher.getExternalSource().getId(),
            externalId: attacher.getExternalId()
        };

    }
}

export interface JsonAttacher {
    id?: number;
    importableId: number;
    externalSourceId: number;
    externalId: string;
}

