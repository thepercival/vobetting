import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompetitionRepository, ExternalSystemRepository, SeasonRepository } from 'ngx-sport';

import { UserRepository } from '../user/repository';
import { AdminRoutingModule } from './admin-routing.module';
import { AssociationEditComponent } from './association/edit.component';
import { AssociationListComponent } from './association/list.component';
import { CompetitionEditComponent } from './competition/edit.component';
import { CompetitionListComponent } from './competition/list.component';
import { ExternalSystemEditComponent } from './externalsystem/edit.component';
import { ExternalSystemListComponent } from './externalsystem/list.component';
import { HomeComponent } from './home/home.component';
import { SeasonEditComponent } from './season/edit.component';
import { SeasonListComponent } from './season/list.component';

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
    CompetitionEditComponent, CompetitionListComponent,
    HomeComponent],
  providers: [UserRepository, ExternalSystemRepository, SeasonRepository, CompetitionRepository]
})
export class AdminModule { }
