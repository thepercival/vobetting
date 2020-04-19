
export class Bookmaker {
    static readonly MAX_LENGTH_NAME = 30;

    protected id: string | number;
    protected exchange: boolean;

    constructor(protected name: string, exchange?: boolean) {
        this.exchange = (exchange === true);
    }

    getId(): string | number {
        return this.id;
    }

    setId(id: string | number): void {
        this.id = id;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getExchange(): boolean {
        return this.exchange;
    }

    setExchange(exchange: boolean) {
        this.exchange = exchange;
    }
}
