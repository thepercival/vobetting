import { Observable } from 'rxjs';

import { Association, League, Season } from 'ngx-sport';


export interface ExternalSourceAssociation {
    getAssociations(): Association[];
}

export interface ExternalSourceLeagueInterface {
    getLeagues(appLeagues: League[]): Observable<League[]>;
}

export interface ExternalSourceSeasonInterface {
    getSeasons(): Season[];
}
