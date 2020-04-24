import { BetLine } from './betline';
import { Bookmaker } from './bookmaker';

/**
 * Created by coen on 9-10-17.
 */
export class LayBack {
    protected id: number;
    protected betLine: BetLine;
    protected back: boolean;
    protected price: number;
    private size: number;

    static readonly BACK = true;
    static readonly LAY = false;

    constructor(private dateTime: Date, betLine: BetLine, private bookmaker: Bookmaker, private runner: boolean) {
        this.setBetLine(betLine);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getBack(): boolean {
        return this.back;
    }

    setBack(back: boolean) {
        this.back = back;
    }

    getRunner(): boolean {
        return this.runner;
    }

    setRunner(runner: boolean) {
        this.runner = runner;
    }

    getPrice(): number {
        return this.price;
    }

    setPrice(price: number) {
        this.price = price;
    }

    getSize(): number {
        return this.size;
    }

    setSize(size: number) {
        this.size = size;
    }

    getDateTime(): Date {
        return this.dateTime;
    }

    getBetLine(): BetLine {
        return this.betLine;
    }

    protected setBetLine(betLine: BetLine): void {
        this.betLine = betLine;
        this.betLine.getLayBacks().push(this);
    }

    getBookmaker(): Bookmaker {
        return this.bookmaker;
    }
}
