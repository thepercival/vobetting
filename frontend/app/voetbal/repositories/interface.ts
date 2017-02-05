/**
 * Created by cdunnink on 30-11-2016.
 */

import {Observable} from 'rxjs/Rx';
import {VoetbalInterface} from '../domain/interface';
import {Association} from '../domain/association';
// import { Injectable } from '@angular/core';

// @Injectable()
export interface VoetbalRepositoryInterface {
    getObjects(): Observable<Association[]>;
    getObject( id: number): Observable<VoetbalInterface>;
    createObject( jsonObject: any ): Observable<VoetbalInterface>;
    editObject( object: VoetbalInterface ): Observable<VoetbalInterface>;
    removeObject(object: Association): Observable<void>;
}

