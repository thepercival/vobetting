import { ExternalSource } from 'ngx-sport';

import { BetLine } from './betline';

/**
 * Created by coen on 9-10-17.
 */
export class LayBack {
    protected id: number;
    protected back: boolean;
    protected price: number;
    private size: number;
    protected dateTime: Date;
    protected betLine: BetLine;
    protected externalSource: ExternalSource;

    constructor(dateTime: Date, betLine: BetLine) {
        this.setDateTime(dateTime);
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

    setDateTime(dateTime: Date): void {
        this.dateTime = dateTime;
    }

    getBetLine(): BetLine {
        return this.betLine;
    }

    setBetLine(betLine: BetLine): void {
        this.betLine = betLine;
        this.betLine.getLayBacks().push(this);
    }

    getExternalSource(): ExternalSource {
        return this.externalSource;
    }

    setExternalSource(externalSource: ExternalSource): void {
        this.externalSource = externalSource;
    }
}
