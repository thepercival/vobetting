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
import { BetLineChartComponent } from './betline/chart.component';
import { BetLineMainComponent } from './betline/main.component';
import { BetLineSelectionComponent } from './betline/selection.component';
import { VOBettingRoutingModule } from './vobetting-routing.module';


@NgModule({
  imports: [
    CommonModule,
    VOBettingRoutingModule,
    ReactiveFormsModule,
    NgbAlertModule, NgbCollapseModule, NgbDatepickerModule, NgbPopoverModule, NgbTimepickerModule,
    NgxChartsModule,
  ],
  declarations: [BetLineMainComponent, BetLineSelectionComponent, BetLineChartComponent],
  providers: [CompetitionRepository, BetLineRepository, LayBackRepository]
})
export class VOBettingModule { }
