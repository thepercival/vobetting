import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbCollapseModule, NgbDatepickerModule, NgbPopoverModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CompetitionRepository } from 'ngx-sport';

import { BetLineChartComponent } from './betline/chart.component';
import { BetLineMainComponent } from './betline/main.component';
import { BetLineRepository } from './betline/repository';
import { BetLineSelectionComponent } from './betline/selection.component';
import { LayBackRepository } from './layback/repository';
import { VOBettingRoutingModule } from './vobetting-routing.module';


@NgModule({
  imports: [
    CommonModule,
    VOBettingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule, NgbCollapseModule, NgbDatepickerModule, NgbPopoverModule, NgbTimepickerModule,
    NgxChartsModule,
  ],
  declarations: [BetLineMainComponent, BetLineSelectionComponent, BetLineChartComponent],
  providers: [CompetitionRepository, BetLineRepository, LayBackRepository]
})
export class VOBettingModule { }
