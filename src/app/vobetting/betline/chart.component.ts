import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Game, StructureService } from 'ngx-sport';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { BetLine } from '../betline';
import { LayBack } from '../layback';
import { LayBackRepository } from '../layback/repository';
import { BetLineRepository } from './repository';


@Component({
  selector: 'app-betline-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class BetLineChartComponent implements OnInit, OnDestroy, OnChanges {

  @Input() betTypes: number;
  @Input() games: Game[];
  @Input() structureService: StructureService;
  processing = true;

  betLinesPerGame: any = {};
  allBetLineLayBacks: any = {};
  matchOddsShowChart;
  matchOddsHomeAway;

  // chart: start
  view: any[] = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'tijd';
  showYAxisLabel = true;
  yAxisLabel = 'quotering';
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  autoScale = true;
  // chart: end

  constructor(

    private betLineRepository: BetLineRepository,
    private layBackRepository: LayBackRepository
  ) {
    // const single = this.single;
    // const multi = this.multi;
    // Object.assign(this, { single, multi });
  }

  get MatchOdds() {
    return BetLine.MATCH_ODDS;
  }

  get Home() {
    return Game.HOME;
  }

  get Away() {
    return Game.AWAY;
  }

  onSelect(event) {
    console.log(event);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.games !== undefined && changes.games.currentValue !== undefined) {
      this.matchOddsShowChart = false;
      this.betLinesPerGame = {};
      const betLinesUpdates: Observable<BetLine[]>[] = [];

      this.games.forEach(game => {
        betLinesUpdates.push(this.betLineRepository.getObjects(game, this.betTypes));
      });
      this.processBetLinesFilterHelper(betLinesUpdates);
    }
  }

  protected processBetLinesFilterHelper(reposSearches: Observable<BetLine[]>[]) {

    forkJoin(reposSearches).subscribe(results => {
      // console.log(results);
      results.forEach(betLines => {
        betLines.forEach(betLine => {
          if (this.betLinesPerGame[betLine.getGame().getId()] === undefined) {
            this.betLinesPerGame[betLine.getGame().getId()] = [];
          }
          this.betLinesPerGame[betLine.getGame().getId()].push(betLine);
        });
      });
      this.processing = false;
    },
      err => {
        // this.setAlert('danger', 'volgorde niet gewijzigd: ' + err);
        this.processing = false;
      }
    );
  }

  getGames() {
    console.log(this.betLinesPerGame);
    return this.betLinesPerGame.map(betLine => betLine.getGame());
  }

  getBetTypes() {
    return [this.betTypes];
  }

  getBetTypeDescription(betType: number) {
    if (betType === BetLine.MATCH_ODDS) {
      return 'MATCH_ODDS';
    }
    return undefined;
  }

  getDescription(betType: number, back: boolean) {
    return this.getBetTypeDescription(betType) + ' - ' + (back ? 'back' : 'lay');
  }

  getHomeAwayDescription(betLine: BetLine) {
    console.log(betLine.getPoulePlace());
    return betLine.getGame().getHomePoulePlace() === betLine.getPoulePlace() ? 'thuiswinst' :
      (betLine.getGame().getAwayPoulePlace() === betLine.getPoulePlace() ? 'uitwinst' : 'gelijkspel');
  }

  showChart(game: Game, homeAway?: boolean) {
    this.matchOddsShowChart = false;
    const betLine: BetLine = this.getBetLine(game, homeAway);
    if (betLine === undefined) {
      // set alert
      return;
    }
    this.matchOddsHomeAway = homeAway;
    this.layBackRepository.getObjects(betLine)
      .subscribe(
              /* happy path */(layBacks: LayBack[]) => {
        console.log(layBacks);
        this.allBetLineLayBacks[betLine.getId()] = this.getLayBacks(betLine);
        this.matchOddsShowChart = true;
        console.log(this.allBetLineLayBacks);
        // laybacks are in betline now
      },
              /* error path */ e => { },
              /* onComplete */() => { }
      );
  }

  protected getBetLine(game: Game, homeAway?: boolean): BetLine {
    const betLinesPerGame = this.betLinesPerGame[game.getId()];
    if (betLinesPerGame === undefined) {
      return betLinesPerGame;
    }
    const bl = betLinesPerGame.find(betLine => betLine.getGame().getPoulePlace(homeAway) === betLine.getPoulePlace());
    console.log(bl); return bl;
  }

  getLayBacks(betLine: BetLine) {
    return [
      {
        name: this.getDescription(betLine.getBetType(), true),
        series: this.getLayBacksHelper(betLine.getLayBacks(), true)
      },
      {
        name: this.getDescription(betLine.getBetType(), false),
        series: this.getLayBacksHelper(betLine.getLayBacks(), false)
      },
    ];
  }

  protected getLayBacksHelper(layBacks: LayBack[], back: boolean) {
    const layBacksTmp = layBacks.filter(layBack => layBack.getBack() === back);
    const x = layBacksTmp.map(layback => {
      return {
        name: layback.getDateTime().toISOString(),
        value: layback.getPrice()
      };
    });
    console.log(x); return x;
  }
}
