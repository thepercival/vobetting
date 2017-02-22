/**
 * Created by coen on 11-2-17.
 */

import { ExternalObject} from './external/object';
import { ExternalSystem} from './external/system';

export class Season {
    protected id: number;
    protected name: string;
    protected startdate: Date;
    protected enddate: Date;
    protected externals: ExternalObject[] = [];

    static classname = "Season";

    static readonly MIN_LENGTH_NAME = 2;
    static readonly MAX_LENGTH_NAME = 9;

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

    getStartdate(): Date {
        return this.startdate;
    };

    setStartdate(startdate: Date): void {
        this.startdate = startdate;
    };

    getEnddate(): Date {
        return this.enddate;
    };

    setEnddate(enddate: Date): void {
        this.enddate = enddate;
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