import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { StructureService } from 'ngx-sport';

import { BetLine } from '../betline';
import { LayBack } from '../layback';
import { LayBackRepository } from '../layback/repository';

@Component({
  selector: 'app-betline-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class BetLineChartComponent implements OnInit, OnDestroy {

  @Input() betLines: BetLine[];
  @Input() structureService: StructureService;

  allBetLineLayBacks: any = {};
  view: any[] = [700, 400];

  // options
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
  // line, area
  autoScale = true;

  constructor(
    private layBackRepository: LayBackRepository
  ) {
    // const single = this.single;
    // const multi = this.multi;
    // Object.assign(this, { single, multi });
  }

  onSelect(event) {
    console.log(event);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
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

  showChart(betLine: BetLine) {
    this.layBackRepository.getObjects(betLine)
      .subscribe(
              /* happy path */(layBacks: LayBack[]) => {
        console.log(layBacks);
        this.allBetLineLayBacks[betLine.getId()] = this.getLayBacks(betLine);
        // laybacks are in betline now
      },
              /* error path */ e => { },
              /* onComplete */() => { }
      );
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
