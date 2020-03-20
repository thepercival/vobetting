import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthguardService } from '../auth/authguard.service';
import { HomeComponent } from './home/home.component';
import { ExternalSourceListComponent } from './externalsource/list.component';
import { ExternalSourceEditComponent } from './externalsource/edit.component';
import { AssociationListComponent } from './association/list.component';
import { AssociationEditComponent } from './association/edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AssociationAttachComponent } from './association/attach.component';
import { SportListComponent } from './sport/list.component';
import { SportEditComponent } from './sport/edit.component';
import { SportAttachComponent } from './sport/attach.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthguardService] },
  { path: 'externalsources', component: ExternalSourceListComponent },
  { path: 'externalsource/:id', component: ExternalSourceEditComponent, canActivate: [AuthguardService] }, /*
  { path: 'bookmaker', component: BookmakerListComponent, canActivate: [AuthguardService] },
  { path: 'bookmaker/edit/:id', component: BookmakerEditComponent, canActivate: [AuthguardService] },
  { path: 'season', component: SeasonListComponent, canActivate: [AuthguardService] },
  { path: 'season/edit/:id', component: SeasonEditComponent, canActivate: [AuthguardService] },
  { path: 'season/extern/:id', component: SeasonExternComponent, canActivate: [AuthguardService] }, */
  { path: 'associations', component: AssociationListComponent, canActivate: [AuthguardService] },
  { path: 'association/:id', component: AssociationEditComponent, canActivate: [AuthguardService] },
  { path: 'association/attach/:id/:externalSourceId', component: AssociationAttachComponent, canActivate: [AuthguardService] },
  { path: 'sports', component: SportListComponent, canActivate: [AuthguardService] },
  { path: 'sport/:id', component: SportEditComponent, canActivate: [AuthguardService] },
  { path: 'sport/attach/:id/:externalSourceId', component: SportAttachComponent, canActivate: [AuthguardService] }, /*
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
