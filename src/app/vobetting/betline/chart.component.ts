import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Game, StructureService } from 'ngx-sport';
import { forkJoin, Observable } from 'rxjs';

import { BetLine } from '../../lib/betline';
import { BetLineRepository } from '../../lib/betline/repository';
import { LayBack } from '../../lib/layback';
import { LayBackRepository } from '../../lib/layback/repository';
import { Bookmaker } from 'src/app/lib/bookmaker';
import { SerieRunner, SerieLayBack, SerieBookmaker } from './series';
import { BettingNameService } from 'src/app/lib/nameservice';

@Component({
  selector: 'app-betline-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class BetLineChartComponent implements OnInit {
  @Input() betType: number;
  @Input() runnersSerie: SerieRunner[];

  data: any[];
  processing = true;

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
    private bettingNameService: BettingNameService
  ) {
  }

  onSelect(event) {
    console.log(event);
  }

  ngOnInit() {
    this.data = this.getData();
    this.processing = false;
  }

  protected getData(): any[] {
    console.log('series');
    console.log(this.runnersSerie);
    const data: any[] = [];
    this.runnersSerie.forEach((runnerSerie: SerieRunner) => {
      runnerSerie.layBackSeries.forEach((layBackSerie: SerieLayBack) => {
        layBackSerie.bookmakers.forEach((bookmakerSerie: SerieBookmaker) => {
          data.push({
            name: this.getDescription(runnerSerie.runner, layBackSerie.layOrBack, bookmakerSerie.bookmaker),
            series: bookmakerSerie.layBacks
          });
        });
      });
    });
    console.log('data');
    console.log(data);
    return data;
  }

  // maak nog een color scheme per lay/back bookmaker???

  getDescription(runner: boolean, back: boolean, bookMaker: Bookmaker) {
    let description = this.bettingNameService.getRunnerDescription(this.betType, runner) + ' - ';
    description += (back ? 'back' : 'lay');
    description += ' - ' + bookMaker.getName();
    return description;
  }

  getStyle(color: string) {
    return { 'background-color': color };
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
