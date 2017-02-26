/**
 * Created by coen on 17-2-17.
 */

import { ExternalSystemCompetitionInterface } from './interface';
import { ExternalSystem } from './../system';
import { Association } from './../../association';
import { Competition } from './../../competition';
import { Season } from './../../season';
import { CompetitionSeason } from './../../competitionseason';
import { ExternalSystemSoccerSportsRepository } from './soccersports/repository';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Rx';

export class ExternalSystemSoccerSports extends ExternalSystem implements ExternalSystemCompetitionInterface{
    protected website: string;
    protected repos: ExternalSystemSoccerSportsRepository;
    // protected associations: Association[];
    // protected competitions: Competition[];
    // protected seasons: Season[];
    // protected competitionseasons: CompetitionSeason[];

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
            { "name": Season.classname, "source": true },
            { "name": CompetitionSeason.classname, "source": true }
        ];
    }

    getAssociations(): Observable<Association[]>
    {
        return this.repos.getAssociations()
    }

    getCompetitions(): Observable<Competition[]>
    {
        return this.repos.getCompetitions()
    }

    getSeasons(): Observable<Season[]>
    {
        return this.repos.getSeasons()
    }

    getCompetitionSeasons(): Observable<CompetitionSeason[]>
    {
        return this.repos.getCompetitionSeasons()
    }
}
