import { Attacher } from '../attacher';
import { Injectable } from '@angular/core';
import { ExternalSource } from '../external/source';

@Injectable()
export class AttacherMapper {

    constructor() { }

    toObject(json: JsonAttacher, externalSource: ExternalSource): Attacher {
        const attacher = new Attacher(
            json.importableId,
            externalSource);
        attacher.setId(json.id);
        attacher.setExternalId(json.externalId);
        return attacher;
    }

    toJson(attacher: Attacher): JsonAttacher {
        return {
            id: attacher.getId(),
            importableId: attacher.getImportableId(),
            externalId: attacher.getExternalId()
        };

    }
}

export interface JsonAttacher {
    id?: number;
    importableId: number;
    externalId: string;
}

