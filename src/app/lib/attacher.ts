import { ExternalSource } from './external/source';

export class Attacher {
    static readonly MAX_LENGTH_EXTERNALID = 100;

    protected id: number;
    protected externalId: string;

    constructor(
        protected importableId: number,
        protected externalSource: ExternalSource
    ) {
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getImportableId(): number {
        return this.importableId;
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
