/**
 * Created by coen on 11-2-17.
 */

import { Association } from './../../association';
import { Competition } from './../../competition';
import { Season } from './../../season';
import {Observable} from 'rxjs/Rx';

export interface ExternalSystemAssociation
{
    getAssociations(): Association[];
}

export interface ExternalSystemCompetitionInterface
{
    getCompetitions(): Observable<Competition[]>;
}

export interface ExternalSystemSeasonInterface
{
    getSeasons(): Season[];
}
