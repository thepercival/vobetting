/**
 * Created by coen on 20-3-17.
 */

import { PoulePlace } from './pouleplace';

export class Game {
    protected id: number;
    protected number: number;
    protected startdate: Date;
    protected homePoulePlace: PoulePlace;
    protected awayPoulePlace: PoulePlace;
    protected state: number;

    static readonly STATE_CREATED = 1;
    static readonly STATE_INPLAY = 2;
    static readonly STATE_PLAYED = 4;

    static readonly classname = "Game";

    // constructor
    constructor( number: number, startdate: Date, homePouleplace: PoulePlace, awayPouleplace: PoulePlace){
        this.setNumber(number);
        this.setStartdate(startdate);
        this.setHomePoulePlace(homePouleplace);
        this.setAwayPoulePlace(awayPouleplace);
    }

    getId(): number {
        return this.id;
    };

    setId( id: number): void {
        this.id = id;
    };

    getNumber(): number {
        return this.number;
    };

    setNumber( number: number): void {
        this.number = number;
    };

    getStartdate(): Date {
        return this.startdate;
    };

    setStartdate(startdate: Date): void {
        this.startdate = startdate;
    };

    getHomePoulePlace(): PoulePlace {
        return this.homePoulePlace;
    };

    setHomePoulePlace(homePoulePlace: PoulePlace): void {
        this.homePoulePlace = homePoulePlace;
    };

    getAwayPoulePlace(): PoulePlace {
        return this.awayPoulePlace;
    };

    setAwayPoulePlace(awayPoulePlace: PoulePlace): void {
        this.awayPoulePlace = awayPoulePlace;
    };

    getState(): number {
        return this.state;
    };

    setState( state: number): void {
        this.state = state;
    };
}