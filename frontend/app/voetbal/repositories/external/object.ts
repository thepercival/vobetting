/**
 * Created by coen on 13-2-17.
 */

/**
 * Created by cdunnink on 7-2-2017.
 */

import { ExternalObject } from '../../domain/external/object';
import { ExternalSystemRepository } from './system';
import { Injectable } from '@angular/core';

@Injectable()
export class ExternalObjectRepository {

    private externalSystemRepository: ExternalSystemRepository;
    constructor( externalSystemRepository: ExternalSystemRepository)
    {
       this.externalSystemRepository = externalSystemRepository;
    }

    jsonToArrayHelper( jsonArray : any, importableObject: any ): ExternalObject[]
    {
        let externalObjects: ExternalObject[] = [];
        if ( jsonArray == null ){
            return externalObjects;
        }
        for (let json of jsonArray) {
            externalObjects.push( this.jsonToObjectHelper(json,importableObject) );
        }
        return externalObjects;
    }

    jsonToObjectHelper( json : any, importableObject: any ): ExternalObject
    {
        let externalSystem = null;
        if ( json.externalsystem != null ){
            externalSystem = this.externalSystemRepository.jsonToObjectHelper( json.externalsystem );
        }
        return new ExternalObject(importableObject, externalSystem, json.externalid );
    }
}

