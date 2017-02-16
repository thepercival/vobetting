/**
 * Created by coen on 16-2-17.
 */

import { Association } from './association';
import { Competition } from './competition';
import { Season } from './season';

export class CompetitionSeason {
    protected id: number;
    protected association: Association;
    protected competition: Competition;
    protected season: Season;
    protected state: number;
    protected qualificationrule: number;
    // protected externals: ExternalObject[] = [];

    static readonly classname = "CompetitionSeason";

    static readonly STATE_CREATED = 1;
    static readonly STATE_PUBLISHED = 2;

    // constructor
    constructor( association: Association, competition: Competition, season: Season ){
        this.setAssociation(association);
        this.setCompetition(competition);
        this.setSeason(season);
    }

    getId(): number {
        return this.id;
    };

    setId( id: number): void {
        this.id = id;
    };

    getAssociation(): Association {
        return this.association;
    };

    setAssociation( association: Association): void {
        this.association = association;
    };

    getCompetition(): Competition {
        return this.competition;
    };

    setCompetition( competition: Competition): void {
        this.competition = competition;
    };

    getSeason(): Season {
        return this.season;
    };

    setSeason( season: Season): void {
        this.season = season;
    };
    
    getState(): number {
        return this.state;
    };

    setState( state: number): void {
        this.state = state;
    };

    getStateDescription(): string {
        if ( this.state == CompetitionSeason.STATE_CREATED ){
            return 'aangemaakt';
        }
        else if ( this.state == CompetitionSeason.STATE_PUBLISHED ){
            return 'gepubliceerd';
        }

        return null;
    };

    getQualificationrule(): number {
        return this.qualificationrule;
    };

    setQualificationrule( qualificationrule: number): void {
        this.qualificationrule = qualificationrule;
    };

    getName(): string {
        return this.getCompetition().getName() + ' ' + this.getSeason().getName();
    }

    /*getExternals(): ExternalObject[] {
        return this.externals;
    };

    addExternals( externals: ExternalObject[] ): void  {
        for (let external of externals ) {
            this.externals.push(external);
        }
    };

    getExternal( externalid: string, externalsystem: ExternalSystem ): ExternalObject {
        let foundExternals = this.getExternals().filter( external => external.getExternalid() == externalid && ( ( external.getExternalSystem() == null && externalsystem == null ) || external.getExternalSystem().getId() == externalsystem.getId() ) );
        if ( foundExternals.length != 1 ) {
            return null;
        }
        return foundExternals[0];
    }

    hasExternalid( externalid: string, externalsystem: ExternalSystem ): boolean {
        return this.getExternal(externalid, externalsystem) != null;
    }*/
}
