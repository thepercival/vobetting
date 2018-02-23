import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompetitionseasonRepository } from 'ngx-sport';

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
    NgbModule
  ],
  declarations: [BetLineMainComponent, BetLineSelectionComponent, BetLineChartComponent],
  providers: [CompetitionseasonRepository, BetLineRepository, LayBackRepository]
})
export class VOBettingModule { }
