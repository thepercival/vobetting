import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  NgbAlertModule,
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbPopoverModule,
  NgbTimepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  AssociationRepository,
  CompetitionRepository,
  CompetitorRepository,
  ExternalObjectRepository,
  ExternalSystemMapper,
  ExternalSystemRepository,
  FieldRepository,
  GameRepository,
  LeagueRepository,
  PoulePlaceRepository,
  RefereeRepository,
  RoundNumberConfigRepository,
  RoundRepository,
  SeasonRepository,
  StructureRepository,
} from 'ngx-sport';

import { BookmakerRepository } from '../lib/bookmaker/repository';
import { UserRepository } from '../user/repository';
import { AdminRoutingModule } from './admin-routing.module';
import { AssociationEditComponent } from './association/edit.component';
import { AssociationListComponent } from './association/list.component';
import { BookmakerEditComponent } from './bookmaker/edit.component';
import { BookmakerListComponent } from './bookmaker/list.component';
import { CompetitionEditComponent } from './competition/edit.component';
import { CompetitionHomeComponent } from './competition/home.component';
import { CompetitionListComponent } from './competition/list.component';
import { CompetitorEditComponent } from './competitor/edit.component';
import { CompetitorExternComponent } from './competitor/extern.component';
import { CompetitorListComponent } from './competitor/list.component';
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

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule, NgbCollapseModule, NgbDatepickerModule, NgbPopoverModule, NgbTimepickerModule,
    FontAwesomeModule
  ],
  declarations: [HomeComponent,
    ExternalSystemListComponent, ExternalSystemEditComponent,
    BookmakerListComponent, BookmakerEditComponent,
    SeasonListComponent, SeasonEditComponent, SeasonExternComponent,
    AssociationListComponent, AssociationEditComponent,
    CompetitorListComponent, CompetitorEditComponent, CompetitorExternComponent,
    LeagueEditComponent, LeagueListComponent, LeagueExternComponent,
    CompetitionEditComponent, CompetitionListComponent, CompetitionHomeComponent,
    StructureEditComponent, GameListComponent,
    HomeComponent, PoulePlaceEditComponent],
  providers: [UserRepository, ExternalSystemRepository, SeasonRepository, LeagueRepository,
    CompetitionRepository, FieldRepository, RefereeRepository, CompetitorRepository, AssociationRepository,
    StructureRepository, RoundRepository, RoundNumberConfigRepository, PoulePlaceRepository,
    GameRepository, ExternalObjectRepository, BookmakerRepository, ExternalSystemMapper]
})
export class AdminModule { }
