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
import { CompetitionMapper } from 'ngx-sport';

@NgModule({
  imports: [
    CommonModule,
    VOBettingRoutingModule,
    ReactiveFormsModule,
    NgbAlertModule, NgbCollapseModule, NgbDatepickerModule, NgbPopoverModule, NgbTimepickerModule,
    NgxChartsModule,
    FontAwesomeModule
  ],
  declarations: [
    BetGameListComponent, BetGameComponent/*, BetLineSelectionComponent, BetLineChartComponent, */
  ],
  providers: [
    BetGameRepository,
    BetLineRepository,
    LayBackRepository
  ]
})
export class VOBettingModule {
  constructor() {
  }
}
