import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthguardService } from '../auth/authguard.service';
import { HomeComponent } from './home/home.component';
import { ExternalSystemListComponent } from './externalsystem/list.component';
import { ExternalSystemEditComponent } from './externalsystem/edit.component';
import { AssociationListComponent } from './association/list.component';
import { AssociationEditComponent } from './association/edit.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthguardService] },
  { path: 'externalsystem', component: ExternalSystemListComponent, canActivate: [AuthguardService] },
  { path: 'externalsystem/edit/:id', component: ExternalSystemEditComponent, canActivate: [AuthguardService] }, /*
  { path: 'bookmaker', component: BookmakerListComponent, canActivate: [AuthguardService] },
  { path: 'bookmaker/edit/:id', component: BookmakerEditComponent, canActivate: [AuthguardService] },
  { path: 'season', component: SeasonListComponent, canActivate: [AuthguardService] },
  { path: 'season/edit/:id', component: SeasonEditComponent, canActivate: [AuthguardService] },
  { path: 'season/extern/:id', component: SeasonExternComponent, canActivate: [AuthguardService] }, */
  { path: 'association', component: AssociationListComponent, canActivate: [AuthguardService] },
  { path: 'association/edit/:id', component: AssociationEditComponent, canActivate: [AuthguardService] }, /*
  { path: 'competitor/:associationid', component: CompetitorListComponent, canActivate: [AuthguardService] },
  { path: 'competitor/edit/:associationid/:id', component: CompetitorEditComponent, canActivate: [AuthguardService] },
  { path: 'competitor/extern/:associationid/:id', component: CompetitorExternComponent, canActivate: [AuthguardService] },
  { path: 'league', component: LeagueListComponent, canActivate: [AuthguardService] },
  { path: 'league/edit/:id', component: LeagueEditComponent, canActivate: [AuthguardService] },
  { path: 'league/extern/:id', component: LeagueExternComponent, canActivate: [AuthguardService] },
  { path: 'competition', component: CompetitionListComponent, canActivate: [AuthguardService] },
  { path: 'competition/home/:id', component: CompetitionHomeComponent, canActivate: [AuthguardService] },
  { path: 'competition/edit/:id', component: CompetitionEditComponent, canActivate: [AuthguardService] },
  { path: 'pouleplace/edit/:competitionid/:id', component: PoulePlaceEditComponent, canActivate: [AuthguardService] },
  { path: 'structure/:id', component: StructureEditComponent, canActivate: [AuthguardService] },
  { path: 'games/:id', component: GameListComponent, canActivate: [AuthguardService] },*/
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes), ReactiveFormsModule],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
