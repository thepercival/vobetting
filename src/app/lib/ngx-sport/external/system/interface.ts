import { Observable } from 'rxjs';

import { Association, League, Season } from 'ngx-sport';


export interface ExternalSystemAssociation {
    getAssociations(): Association[];
}

export interface ExternalSystemLeagueInterface {
    getLeagues(appLeagues: League[]): Observable<League[]>;
}

export interface ExternalSystemSeasonInterface {
    getSeasons(): Season[];
}
