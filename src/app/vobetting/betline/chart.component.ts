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

  @Input() betType: number;
  @Input() game: Game;
  @Input() structureService: StructureService;
  processing = true;

  showChart = false;
  betLines: BetLine[];
  chartLayBacks: any[];
  filter: any = {
    thuis: true,
    gelijk: true,
    uit: true
  };

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
    if (changes.game !== undefined && changes.game.currentValue !== undefined) {
      this.betLineRepository.getObjects(this.game, this.betType).subscribe(betLines => {
        this.betLines = betLines;
      },
        /* error path */ e => { this.processing = false; },
        /* onComplete */() => { this.processing = false; }
      );
    }
  }

  toggleChart() {
    this.processing = true;
    this.setLayBacks();
    this.showChart = true;
  }

  setLayBacks() {
    const obsLayBacks: Observable<LayBack[]>[] = [];

    this.betLines.forEach(betLine => {
      obsLayBacks.push(this.layBackRepository.getObjects(betLine));
    });
    this.processLayBacks(obsLayBacks);
  }

  protected processLayBacks(obsLayBacks: Observable<LayBack[]>[]) {
    forkJoin(obsLayBacks).subscribe(results => {
      results.forEach(layBacks => {
        layBacks.forEach(layBack => {
          // do nothing
        });
      });
      let chartLayBacks: LayBack[] = [];
      this.betLines.forEach((betLine) => {
        chartLayBacks = chartLayBacks.concat(this.getLayBacks(betLine));
      });
      this.chartLayBacks = chartLayBacks;
      this.processing = false;
    },
      err => {
        // this.setAlert('danger', 'volgorde niet gewijzigd: ' + err);
        this.processing = false;
      }
    );
  }

  getBetTypeDescription(betType: number) {
    if (betType === BetLine.MATCH_ODDS) {
      return 'MATCH_ODDS';
    }
    return undefined;
  }

  getDescription(betType: number, back: boolean, homeAway?: boolean) {
    return this.getBetTypeDescription(betType) + ' - ' + this.getHomeAwayDescription(homeAway) + ' - ' + (back ? 'back' : 'lay');
  }

  getHomeAway(betLine: BetLine): boolean {
    return this.game.getHomeAway(betLine.getPoulePlace());
  }

  getHomeAwayDescription(homeAway?: boolean) {
    return homeAway === true ? 'thuis' : (homeAway === false ? 'uit' : 'gelijk');
  }

  updateFilter(betLine: BetLine) {
    // update filter
    // filter: any = {
    //   thuis: true,
    //   gelijk: true,
    //   uit: true
    // };
  }

  protected getBetLine(homeAway?: boolean): BetLine {
    return this.betLines.find(betLine => betLine.getGame().getPoulePlace(homeAway) === betLine.getPoulePlace());
  }

  getLayBacks(betLine: BetLine): any[] {
    return [
      {
        name: this.getDescription(betLine.getBetType(), true, this.getHomeAway(betLine)),
        series: this.getLayBacksHelper(betLine, true)
      },
      {
        name: this.getDescription(betLine.getBetType(), false, this.getHomeAway(betLine)),
        series: this.getLayBacksHelper(betLine, false)
      },
    ];
  }

  protected getLayBacksHelper(betLine: BetLine, back: boolean) {
    const layBacks: LayBack[] = betLine.getLayBacks();
    const layBacksTmp = layBacks.filter(layBack => layBack.getBack() === back);
    return layBacksTmp.map(layback => {
      return {
        name: layback.getDateTime(),
        value: layback.getPrice()
      };
    });
  }
}
