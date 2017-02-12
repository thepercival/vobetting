/**
 * Created by coen on 11-2-17.
 */

import { ExternalSystemSeasonInterface } from './interface';
import { ExternalSystem } from './../system';
import { Season } from '../../season';
import { Http } from '@angular/http';

export class ExternalSystemSeasonsTest extends ExternalSystem implements ExternalSystemSeasonInterface{
    protected website: string;
    protected exportclasses: string[];

    // constructor
    constructor( name: string, http: Http ){
        super(name);
        this.exportclasses = [Season.classname];
    }

    hasAvailableExportClass( exportclassparam: string ): boolean
    {
        let x = this.exportclasses.filter( exportclass => exportclass == exportclassparam);
        return x.length > 0;
    }

    getSeasons(): Season[]
    {
        // roep api aan en geef competitions terug!!!
        // kan ook backend aanroepen en deze gebruiken???
        return [];
    }
}