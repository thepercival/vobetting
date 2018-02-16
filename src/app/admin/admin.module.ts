import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  AssociationRepository,
  CompetitionRepository,
  CompetitionseasonRepository,
  ExternalSystemRepository,
  FieldRepository,
  RefereeRepository,
  SeasonRepository,
  TeamRepository,
} from 'ngx-sport';

import { UserRepository } from '../user/repository';
import { AdminRoutingModule } from './admin-routing.module';
import { AssociationEditComponent } from './association/edit.component';
import { AssociationListComponent } from './association/list.component';
import { CompetitionEditComponent } from './competition/edit.component';
import { CompetitionListComponent } from './competition/list.component';
import { CompetitionseasonEditComponent } from './competitionseason/edit.component';
import { CompetitionseasonListComponent } from './competitionseason/list.component';
import { ExternalSystemEditComponent } from './externalsystem/edit.component';
import { ExternalSystemListComponent } from './externalsystem/list.component';
import { HomeComponent } from './home/home.component';
import { SeasonEditComponent } from './season/edit.component';
import { SeasonListComponent } from './season/list.component';
import { StructureEditComponent } from './structure/edit.component';
import { TeamEditComponent } from './team/edit.component';
import { TeamListComponent } from './team/list.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  declarations: [HomeComponent,
    ExternalSystemListComponent, ExternalSystemEditComponent,
    SeasonListComponent, SeasonEditComponent,
    AssociationListComponent, AssociationEditComponent,
    TeamListComponent, TeamEditComponent,
    CompetitionEditComponent, CompetitionListComponent,
    CompetitionseasonEditComponent, CompetitionseasonListComponent,
    StructureEditComponent,
    HomeComponent],
  providers: [UserRepository, ExternalSystemRepository, SeasonRepository, CompetitionRepository,
    CompetitionseasonRepository, FieldRepository, RefereeRepository, TeamRepository, AssociationRepository]
})
export class AdminModule { }
