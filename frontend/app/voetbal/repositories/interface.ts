/**
 * Created by cdunnink on 30-11-2016.
 */

import {Observable} from 'rxjs/Rx';
import {VoetbalInterface} from '../domain/interface';
// import { Injectable } from '@angular/core';

// @Injectable()
export interface VoetbalRepositoryInterface {
    getObjects(): Observable<VoetbalInterface[]>;
    getObject( id: number): Observable<VoetbalInterface>;
    createObject( object: VoetbalInterface ): Observable<VoetbalInterface>;
    editObject( object: VoetbalInterface ): Observable<VoetbalInterface>;
    removeObject(object: VoetbalInterface): Observable<void>;
}

