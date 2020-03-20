import { ExternalSource } from '.';
import { Injectable } from '@angular/core';

@Injectable()
export class ExternalSourceMapper {

    constructor() { }

    toObject(json: JsonExternalSource, externalSource?: ExternalSource): ExternalSource {
        if (externalSource === undefined) {
            externalSource = new ExternalSource(json.name);
        }
        externalSource.setId(json.id);
        externalSource.setImplementations(json.implementations);
        externalSource.setWebsite(json.website);
        externalSource.setUsername(json.username);
        externalSource.setPassword(json.password);
        externalSource.setApiurl(json.apiurl);
        externalSource.setApikey(json.apikey);
        return externalSource;
    }

    toJson(source: ExternalSource): JsonExternalSource {
        return {
            id: source.getId(),
            name: source.getName(),
            implementations: source.getImplementations(),
            website: source.getWebsite(),
            username: source.getUsername(),
            password: source.getPassword(),
            apiurl: source.getApiurl(),
            apikey: source.getApikey()
        };
    }
}

export interface JsonExternalSource {
    id?: number;
    name: string;
    implementations: number;
    website?: string;
    username?: string;
    password?: string;
    apiurl?: string;
    apikey?: string;
}
