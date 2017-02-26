/**
 * Created by coen on 26-2-17.
 */

import { Association } from './association';
import { ExternalObject} from './external/object';
import { ExternalSystem} from './external/system';

export class Team {
    protected id: number;
    protected name: string;
    protected abbreviation: string;
    protected association: Association;
    protected externals: ExternalObject[] = [];

    static readonly classname = "Team";

    static readonly MIN_LENGTH_NAME = 3;
    static readonly MAX_LENGTH_NAME = 30;
    static readonly MAX_LENGTH_ABBREVIATION = 7;

    // constructor
    constructor( name: string ){
        this.setName(name);
    }

    getId(): number {
        return this.id;
    };

    setId( id: number): void {
        this.id = id;
    };

    getName(): string {
        return this.name;
    };

    setName(name: string): void {
        this.name = name;
    };

    getAbbreviation(): string {
        return this.abbreviation;
    };

    setAbbreviation(abbreviation: string): void {
        this.abbreviation = abbreviation;
    };

    getAssociation(): Association {
        return this.association;
    };

    setAssociation( association: Association): void {
        this.association = association;
    };

    getExternals(): ExternalObject[] {
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
    }
}