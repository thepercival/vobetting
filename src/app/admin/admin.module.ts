import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap/alert/alert.module';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap/collapse/collapse.module';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap/popover/popover.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap/timepicker/timepicker.module';
import {
  AssociationRepository,
  CompetitionRepository,
  CompetitionseasonRepository,
  ExternalObjectRepository,
  ExternalSystemRepository,
  FieldRepository,
  GameRepository,
  GameScoreRepository,
  PoulePlaceRepository,
  PouleRepository,
  QualifyRuleRepository,
  RefereeRepository,
  RoundConfigRepository,
  RoundRepository,
  RoundScoreConfigRepository,
  SeasonRepository,
  StructureRepository,
  TeamRepository,
} from 'ngx-sport';

import { UserRepository } from '../user/repository';
import { AdminRoutingModule } from './admin-routing.module';
import { AssociationEditComponent } from './association/edit.component';
import { AssociationListComponent } from './association/list.component';
import { CompetitionEditComponent } from './competition/edit.component';
import { CompetitionExternComponent } from './competition/extern.component';
import { CompetitionListComponent } from './competition/list.component';
import { CompetitionseasonEditComponent } from './competitionseason/edit.component';
import { CompetitionseasonHomeComponent } from './competitionseason/home.component';
import { CompetitionseasonListComponent } from './competitionseason/list.component';
import { ExternalSystemEditComponent } from './externalsystem/edit.component';
import { ExternalSystemListComponent } from './externalsystem/list.component';
import { GameListComponent } from './games/list.component';
import { HomeComponent } from './home/home.component';
import { PoulePlaceEditComponent } from './pouleplace/edit.component';
import { SeasonEditComponent } from './season/edit.component';
import { SeasonListComponent } from './season/list.component';
import { StructureEditComponent } from './structure/edit.component';
import { TeamEditComponent } from './team/edit.component';
import { TeamExternComponent } from './team/extern.component';
import { TeamListComponent } from './team/list.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule, NgbCollapseModule, NgbDatepickerModule, NgbPopoverModule, NgbTimepickerModule,
  ],
  declarations: [HomeComponent,
    ExternalSystemListComponent, ExternalSystemEditComponent,
    SeasonListComponent, SeasonEditComponent,
    AssociationListComponent, AssociationEditComponent,
    TeamListComponent, TeamEditComponent, TeamExternComponent,
    CompetitionEditComponent, CompetitionListComponent, CompetitionExternComponent,
    CompetitionseasonEditComponent, CompetitionseasonListComponent, CompetitionseasonHomeComponent,
    StructureEditComponent, GameListComponent,
    HomeComponent, PoulePlaceEditComponent],
  providers: [UserRepository, ExternalSystemRepository, SeasonRepository, CompetitionRepository,
    CompetitionseasonRepository, FieldRepository, RefereeRepository, TeamRepository, AssociationRepository,
    StructureRepository, RoundRepository, RoundConfigRepository, RoundScoreConfigRepository, PouleRepository, PoulePlaceRepository,
    GameRepository, GameScoreRepository, QualifyRuleRepository, ExternalObjectRepository]
})
export class AdminModule { }
