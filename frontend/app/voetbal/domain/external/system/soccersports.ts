/**
 * Created by coen on 17-2-17.
 */

import { ExternalSystemCompetitionInterface } from './interface';
import { ExternalSystem } from './../system';
import { Competition } from './../../competition';
import { ExternalSystemSoccerSportsRepository } from './soccersports/repository';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Rx';

export class ExternalSystemSoccerSports extends ExternalSystem implements ExternalSystemCompetitionInterface{
    protected website: string;
    protected repos: ExternalSystemSoccerSportsRepository;
    protected competitions: Competition[];

    // constructor
    constructor( name: string, http: Http )
    {
        super(name);
        this.repos = new ExternalSystemSoccerSportsRepository( http, this );
    }

    getExportableClasses(): any[]
    {
        return [
            { "name": Competition.classname, "source": true }
        ];
    }

    getCompetitions( appCompetitions: Competition[] ): Observable<Competition[]>
    {
        return this.repos.getCompetitions( appCompetitions )
    }
}
