/**
 * Created by coen on 17-2-17.
 */

import { ExternalSystemCompetitionInterface } from './interface';
import { ExternalSystem } from './../system';
import { Association } from './../../association';
import { Competition } from './../../competition';
import { Season } from './../../season';
import { ExternalSystemSoccerSportsRepository } from './soccersports/repository';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Rx';

export class ExternalSystemSoccerSports extends ExternalSystem implements ExternalSystemCompetitionInterface{
    protected website: string;
    protected repos: ExternalSystemSoccerSportsRepository;
    protected competitions: Competition[];
    protected associations: Association[];
    protected seasons: Season[];

    // constructor
    constructor( name: string, http: Http )
    {
        super(name);
        this.repos = new ExternalSystemSoccerSportsRepository( http, this );
    }

    getExportableClasses(): any[]
    {
        return [
            { "name": Association.classname, "source": true },
            { "name": Competition.classname, "source": true },
            { "name": Season.classname, "source": true }
        ];
    }

    getCompetitions( appCompetitions: Competition[] ): Observable<Competition[]>
    {
        return this.repos.getCompetitions( appCompetitions )
    }

    getAssociations( appAssociations: Association[] ): Observable<Association[]>
    {
        return this.repos.getAssociations( appAssociations )
    }

    getSeasons( appSeasons: Season[] ): Observable<Season[]>
    {
        return this.repos.getSeasons( appSeasons )
    }
}
