import { Bookmaker } from "src/app/lib/bookmaker";

export interface SerieRunner {
    runner: boolean;
    layBackSeries: SerieLayBack[];
}

export interface SerieLayBack {
    layOrBack: boolean;
    bookmakers: SerieBookmaker[];
}

export interface SerieBookmaker {
    bookmaker: Bookmaker;
    layBacks: SerieData[];
}

export interface SerieData {
    name: Date;
    value: number
}