
export class Bookmaker {
    static readonly MAX_LENGTH_NAME = 30;

    protected id: number;
    protected name: string;
    protected exchange: boolean;

    constructor() {
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
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
