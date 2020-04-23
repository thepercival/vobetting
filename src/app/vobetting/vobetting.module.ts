import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NgbAlertModule,
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbPopoverModule,
  NgbTimepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CompetitionRepository } from '../lib/ngx-sport/competition/repository';

import { BetLineRepository } from '../lib/betline/repository';
import { LayBackRepository } from '../lib/layback/repository';
import { VOBettingRoutingModule } from './vobetting-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BetGameRepository } from '../lib/betgame/repository';
import { BetGameListComponent } from './betgames/betgamelist.component';
import { BetGameComponent } from './betgames/betgame.component';
import { BetLineMapper } from '../lib/betline/mapper';
import { BetLineChartComponent } from './betline/chart.component';
import { LayBackMapper } from '../lib/layback/mapper';

@NgModule({
  imports: [
    CommonModule,
    VOBettingRoutingModule,
    ReactiveFormsModule,
    NgbAlertModule, NgbCollapseModule, NgbDatepickerModule, NgbPopoverModule, NgbTimepickerModule,
    NgxChartsModule,
    FontAwesomeModule,
  ],
  declarations: [
    BetGameListComponent, BetGameComponent, BetLineChartComponent
  ],
  providers: [
    BetGameRepository,
    BetLineRepository,
    BetLineMapper,
    LayBackRepository,
    LayBackMapper
  ]
})
export class VOBettingModule {
  constructor() {
  }
}
