/**
 * Created by coen on 11-2-17.
 */

import { ExternalSystemCompetitionInterface } from './interface';
import { ExternalSystem } from './../system';
import { Competition } from './../../competition';

export class ExternalSystemSoccerOdds extends ExternalSystem implements ExternalSystemCompetitionInterface{
    protected website: string;
    protected exportclasses: string[];

    // constructor
    constructor( name: string ){
         super(name);
        this.exportclasses = [Competition.constructor.name]; //
    }

    hasAvailableExportClass( exportclassparam: string ): boolean
    {
        let x = this.exportclasses.filter( exportclass => exportclass == exportclassparam);
        return x.length > 0;
    }

    getCompetitions(): Competition[]
    {
        // roep api aan en geef competitions terug!!!
        // kan ook backend aanroepen en deze gebruiken???
        return [];
    }
}
