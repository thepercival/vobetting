/**
 * Created by coen on 16-2-17.
 */

import { Association } from './association';
import { Competition } from './competition';
import { Season } from './season';

export class CompetitionSeason {
    protected id: any;
    protected association: Association;
    protected competition: Competition;
    protected season: Season;
    protected state: number;
    protected qualificationrule: number;
    protected has_structure: boolean;

    static readonly classname = "CompetitionSeason";

    static readonly STATE_CREATED = 1;
    static readonly STATE_PUBLISHED = 2;

    static readonly QUALIFICATION_RULE_WC = 1;
    static readonly QUALIFICATION_RULE_EC = 2;

    // constructor
    constructor( association: Association, competition: Competition, season: Season ){
        this.setAssociation(association);
        this.setCompetition(competition);
        this.setSeason(season);
        this.setQualificationrule(CompetitionSeason.QUALIFICATION_RULE_WC);
    }

    getId(): any {
        return this.id;
    };

    setId( id: any): void {
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

    hasStructure(): boolean {
        return this.has_structure;
    };

    setHasStructure( hasStructure: boolean): void {
        this.has_structure = hasStructure;
    };

    getName(): string {
        return this.getCompetition().getName() + ' ' + this.getSeason().getName();
    }


}
