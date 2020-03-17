import { ExternalSource } from "./externalsource";
import { Importable } from 'ngx-sport';

export class Attacher {
    static readonly MAX_LENGTH_EXTERNALID = 100;

    protected id: number;
    protected externalId: string;

    constructor(
        protected importable: Importable,
        protected externalSource: ExternalSource
    ) {
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getImportable(): Importable {
        return this.importable;
    }

    getExternalSource(): ExternalSource {
        return this.externalSource;
    }

    getExternalId(): string {
        return this.externalId;
    }

    setExternalId(externalId: string) {
        this.externalId = externalId;
    }
}
