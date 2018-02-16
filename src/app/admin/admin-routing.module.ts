import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthguardService } from '../auth/authguard.service';
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


const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthguardService] },
  { path: 'externalsystem', component: ExternalSystemListComponent, canActivate: [AuthguardService] },
  { path: 'externalsystem/edit/:id', component: ExternalSystemEditComponent, canActivate: [AuthguardService] },
  { path: 'season', component: SeasonListComponent, canActivate: [AuthguardService] },
  { path: 'season/edit/:id', component: SeasonEditComponent, canActivate: [AuthguardService] },
  { path: 'association', component: AssociationListComponent, canActivate: [AuthguardService] },
  { path: 'association/edit/:id', component: AssociationEditComponent, canActivate: [AuthguardService] },
  { path: 'team', component: TeamListComponent, canActivate: [AuthguardService] },
  { path: 'team/edit/:id', component: TeamEditComponent, canActivate: [AuthguardService] },
  { path: 'competition', component: CompetitionListComponent, canActivate: [AuthguardService] },
  { path: 'competition/edit/:id', component: CompetitionEditComponent, canActivate: [AuthguardService] },
  { path: 'competitionseason', component: CompetitionseasonListComponent, canActivate: [AuthguardService] },
  { path: 'competitionseason/edit/:id', component: CompetitionseasonEditComponent, canActivate: [AuthguardService] },
  { path: 'structure/edit/:id', component: StructureEditComponent, canActivate: [AuthguardService] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
