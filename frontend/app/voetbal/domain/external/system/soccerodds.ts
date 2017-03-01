/**
 * Created by coen on 11-2-17.
 */

import { ExternalSystemCompetitionInterface } from './interface';
import { ExternalSystem } from './../system';
import { Competition } from './../../competition';
import { Team } from './../../team';
import { ExternalSystemSoccerOddsRepository } from './soccerodds/repository';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Rx';

export class ExternalSystemSoccerOdds extends ExternalSystem implements ExternalSystemCompetitionInterface{
    protected website: string;
    protected repos: ExternalSystemSoccerOddsRepository;
    protected competitions: Competition[];

    // constructor
    constructor( name: string, http: Http )
    {
        super(name);
        this.repos = new ExternalSystemSoccerOddsRepository( http, this );
    }

    getExportableClasses(): any[]
    {
        return [
            { "name": Competition.classname, "source": false },
            { "name": Team.classname, "source": false }
        ];
    }


    getCompetitions( appCompetitions: Competition[] ): Observable<Competition[]>
    {
        return this.repos.getCompetitions( appCompetitions )
    }
}
