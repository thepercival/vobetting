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
  ExternalObjectRepository,
  ExternalSystemRepository,
  FieldRepository,
  GameRepository,
  GameScoreRepository,
  LeagueRepository,
  PoulePlaceRepository,
  PouleRepository,
  QualifyRuleRepository,
  RefereeRepository,
  RoundConfigRepository,
  RoundConfigScoreRepository,
  RoundRepository,
  SeasonRepository,
  StructureRepository,
  TeamRepository,
} from 'ngx-sport';

import { UserRepository } from '../user/repository';
import { BookmakerRepository } from '../vobetting/bookmaker/repository';
import { AdminRoutingModule } from './admin-routing.module';
import { AssociationEditComponent } from './association/edit.component';
import { AssociationListComponent } from './association/list.component';
import { BookmakerEditComponent } from './bookmaker/edit.component';
import { BookmakerListComponent } from './bookmaker/list.component';
import { CompetitionEditComponent } from './competition/edit.component';
import { CompetitionHomeComponent } from './competition/home.component';
import { CompetitionListComponent } from './competition/list.component';
import { ExternalSystemEditComponent } from './externalsystem/edit.component';
import { ExternalSystemListComponent } from './externalsystem/list.component';
import { GameListComponent } from './games/list.component';
import { HomeComponent } from './home/home.component';
import { LeagueEditComponent } from './league/edit.component';
import { LeagueExternComponent } from './league/extern.component';
import { LeagueListComponent } from './league/list.component';
import { PoulePlaceEditComponent } from './pouleplace/edit.component';
import { SeasonEditComponent } from './season/edit.component';
import { SeasonExternComponent } from './season/extern.component';
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
    BookmakerListComponent, BookmakerEditComponent,
    SeasonListComponent, SeasonEditComponent, SeasonExternComponent,
    AssociationListComponent, AssociationEditComponent,
    TeamListComponent, TeamEditComponent, TeamExternComponent,
    LeagueEditComponent, LeagueListComponent, LeagueExternComponent,
    CompetitionEditComponent, CompetitionListComponent, CompetitionHomeComponent,
    StructureEditComponent, GameListComponent,
    HomeComponent, PoulePlaceEditComponent],
  providers: [UserRepository, ExternalSystemRepository, SeasonRepository, LeagueRepository,
    CompetitionRepository, FieldRepository, RefereeRepository, TeamRepository, AssociationRepository,
    StructureRepository, RoundRepository, RoundConfigRepository, RoundConfigScoreRepository, PouleRepository, PoulePlaceRepository,
    GameRepository, GameScoreRepository, QualifyRuleRepository, ExternalObjectRepository, BookmakerRepository]
})
export class AdminModule { }
