/**
 * Created by coen on 30-1-17.
 */

import { ExternalObject} from './external/object';
import { ExternalSystem} from './external/system';

export class Association{
    protected id: number;
    protected name: string;
    protected description: string;
    protected parent: Association;
    protected externals: ExternalObject[] = [];

    static classname = "Association";

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

    getDescription(): string {
        return this.description;
    };

    setDescription(description: string): void {
        this.description = description;
    };

    getParent(): Association {
        return this.parent;
    };

    setParent(parent: Association): void {
        this.parent = parent;
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