import { Component, Input, OnInit } from '@angular/core';
import { LayBack } from '../../lib/layback';
import { Bookmaker } from 'src/app/lib/bookmaker';
import { SerieRunner, SerieLayBack, SerieBookmaker } from './series';
import { BettingNameService } from 'src/app/lib/nameservice';

@Component({
  selector: 'app-betline-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class BetLineChartComponent implements OnInit {
  @Input() title: string;
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
    console.log('series', this.runnersSerie);
    const data: any[] = [];
    this.runnersSerie.forEach((runnerSerie: SerieRunner) => {
      runnerSerie.layBackSeries.forEach((layBackSerie: SerieLayBack) => {
        layBackSerie.bookmakers.forEach((bookmakerSerie: SerieBookmaker) => {
          this.colorScheme.domain.push(this.getColor(layBackSerie.layOrBack, bookmakerSerie.bookmaker));
          data.push({
            name: this.getDescription(runnerSerie.runner, layBackSerie.layOrBack, bookmakerSerie.bookmaker),
            series: bookmakerSerie.layBacks
          });
        });
      });
    });
    console.log('data', data);
    return data;
  }

  // maak nog een color scheme per lay/back bookmaker???

  getDescription(runner: boolean, back: boolean, bookMaker: Bookmaker) {
    let description = '';
    description += bookMaker.getName();
    description += ' - ';
    description += (back ? 'back' : 'lay');
    description += ' - ';
    description += this.bettingNameService.getRunnerDescription(this.betType, runner);
    return description;
  }

  getStyle(color: string) {
    return { 'background-color': color };
  }


  // '#000080', /* back home */
  // '#3090C7', /* lay home */
  // '#800517', /* back away */
  // '#FF2400', /* lay away */
  // '#348017', /* back draw */
  // '#6CC417' /* lay draw */
  protected getColor(layOrBack: boolean, bookmaker: Bookmaker): string {
    if (layOrBack === LayBack.BACK) {
      if (bookmaker.getName() === 'matchbook') {
        return '#000080';
      } else if (bookmaker.getName() === 'betfair') {
        return '#3090C7';
      }
      return 'purple';
    } else if (layOrBack === LayBack.LAY) {
      if (bookmaker.getName() === 'matchbook') {
        return '#800517';
      } else if (bookmaker.getName() === 'betfair') {
        return '#FF2400';
      }
      return 'orange';
    }
    return 'black';
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
