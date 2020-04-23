import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Game, StructureService } from 'ngx-sport';
import { forkJoin, Observable } from 'rxjs';

import { BetLine } from '../../lib/betline';
import { BetLineRepository } from '../../lib/betline/repository';
import { LayBack } from '../../lib/layback';
import { LayBackRepository } from '../../lib/layback/repository';

@Component({
  selector: 'app-betline-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class BetLineChartComponent implements OnInit {

  @Input() betLine: BetLine;
  @Input() game: Game;

  processing = true;
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
    domain: [
      '#000080', /* back home */
      '#3090C7', /* lay home */
      '#800517', /* back away */
      '#FF2400', /* lay away */
      '#348017', /* back draw */
      '#6CC417' /* lay draw */
    ]
  };
  autoScale = true;
  animations: boolean = true;
  // chart: end

  constructor(
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
    this.setChartLayBacks(this.betLine);
    this.processing = false;
  }

  getDescription(betType: number, back: boolean, homeAway?: boolean) {
    return this.getHomeAwayDescription(homeAway) + ' - ' + (back ? 'back' : 'lay');
  }

  getHomeAway(betLine: BetLine): boolean {
    return this.game.getHomeAway(betLine.getPlace());
  }

  getHomeAwayDescription(homeAway?: boolean) {
    return homeAway === true ? 'thuis' : (homeAway === false ? 'uit' : 'gelijk');
  }

  getStyle(color: string) {
    console.log(color);
    return { 'background-color': color };
  }

  // updateFilter(betLine: BetLine) {
  //   // update filter
  //   // filter: any = {
  //   //   thuis: true,
  //   //   gelijk: true,
  //   //   uit: true
  //   // };
  // }

  setChartLayBacks(betLine: BetLine) {
    this.chartLayBacks = [
      {
        name: this.getDescription(betLine.getBetType(), LayBack.BACK, this.getHomeAway(betLine)),
        series: this.getLayBacksHelper(betLine, LayBack.BACK)
      },
      {
        name: this.getDescription(betLine.getBetType(), LayBack.LAY, this.getHomeAway(betLine)),
        series: this.getLayBacksHelper(betLine, LayBack.LAY)
      },
    ];
    console.log(this.chartLayBacks);
  }

  protected getLayBacksHelper(betLine: BetLine, backOrLay: boolean) {
    const layBacks: LayBack[] = betLine.getLayBacks();
    console.log(layBacks);
    console.log(layBacks.length);
    const layBacksTmp = layBacks.filter(layBack => layBack.getBack() === backOrLay && layBack.getPrice() < 8);
    console.log(layBacksTmp.length);
    return layBacksTmp.map(layback => {
      return {
        name: layback.getDateTime(),
        value: layback.getPrice()
      };
    });
  }

  getPerformance(items: any[]) {
    let back = 0; // let lay = 0;
    items.forEach(item => {
      if (item.series.search('back') >= 0) {
        back += 100 / item.value;
      }
    });
    return back;
  }
}
