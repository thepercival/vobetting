/**
 * Created by coen on 10-2-17.
 */

import { ExternalObject} from './external/object';
import { ExternalSystem} from './external/system';

export class Competition {
    protected id: number;
    protected name: string;
    protected externals: ExternalObject[] = [];

    static classname = "Competition";

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

    getExternals(): ExternalObject[] {
        return this.externals;
    };

    addExternals( externals: ExternalObject[] ): void  {
        for (let external of externals ) {
            this.externals.push(external);
        }
    };

    hasExternalid( externalid: string, externalsystem: ExternalSystem ): boolean {
        let foundExternals = this.getExternals().filter( external => external.getExternalid() == externalid && ( ( external.getExternalSystem() == null && externalsystem == null ) || external.getExternalSystem().getId() == externalsystem.getId() ) );
        return foundExternals.length > 0;
    }
}