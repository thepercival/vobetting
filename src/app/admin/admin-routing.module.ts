import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthguardService } from '../auth/authguard.service';
import { AssociationEditComponent } from './association/edit.component';
import { AssociationListComponent } from './association/list.component';
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


const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthguardService] },
  { path: 'externalsystem', component: ExternalSystemListComponent, canActivate: [AuthguardService] },
  { path: 'externalsystem/edit/:id', component: ExternalSystemEditComponent, canActivate: [AuthguardService] },
  { path: 'season', component: SeasonListComponent, canActivate: [AuthguardService] },
  { path: 'season/edit/:id', component: SeasonEditComponent, canActivate: [AuthguardService] },
  { path: 'season/extern/:id', component: SeasonExternComponent, canActivate: [AuthguardService] },
  { path: 'association', component: AssociationListComponent, canActivate: [AuthguardService] },
  { path: 'association/edit/:id', component: AssociationEditComponent, canActivate: [AuthguardService] },
  { path: 'team/:associationid', component: TeamListComponent, canActivate: [AuthguardService] },
  { path: 'team/edit/:associationid/:id', component: TeamEditComponent, canActivate: [AuthguardService] },
  { path: 'team/extern/:associationid/:id', component: TeamExternComponent, canActivate: [AuthguardService] },
  { path: 'league', component: LeagueListComponent, canActivate: [AuthguardService] },
  { path: 'league/edit/:id', component: LeagueEditComponent, canActivate: [AuthguardService] },
  { path: 'league/extern/:id', component: LeagueExternComponent, canActivate: [AuthguardService] },
  { path: 'competition', component: CompetitionListComponent, canActivate: [AuthguardService] },
  { path: 'competition/home/:id', component: CompetitionHomeComponent, canActivate: [AuthguardService] },
  { path: 'competition/edit/:id', component: CompetitionEditComponent, canActivate: [AuthguardService] },
  { path: 'pouleplace/edit/:competitionid/:id', component: PoulePlaceEditComponent, canActivate: [AuthguardService] },
  { path: 'structure/:id', component: StructureEditComponent, canActivate: [AuthguardService] },
  { path: 'games/:id', component: GameListComponent, canActivate: [AuthguardService] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
