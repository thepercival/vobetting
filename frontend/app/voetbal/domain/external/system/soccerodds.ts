/**
 * Created by coen on 11-2-17.
 */

import { ExternalSystemCompetitionInterface } from './interface';
import { ExternalSystem } from './../system';
import { Competition } from './../../competition';
import { ExternalSystemSoccerOddsRepository } from './soccerodds/repository';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Rx';

export class ExternalSystemSoccerOdds extends ExternalSystem implements ExternalSystemCompetitionInterface{
    protected website: string;
    protected exportclasses: string[];
    protected repos: ExternalSystemSoccerOddsRepository;
    protected competitions: Competition[];

    // constructor
    constructor( name: string, http: Http )
    {
        super(name);
        this.repos = new ExternalSystemSoccerOddsRepository( http, this );
        this.exportclasses = [Competition.classname]; //
    }

    hasAvailableExportClass( exportclassparam: string ): boolean
    {
        let x = this.exportclasses.filter( exportclass => exportclass == exportclassparam);
        return x.length > 0;
    }


    getCompetitions( appCompetitions: Competition[] ): Observable<Competition[]>
    {
        return this.repos.getCompetitions( appCompetitions )
    }
}
