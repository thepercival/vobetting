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
import { SeasonListComponent } from './season/list.component';
import { SeasonEditComponent } from './season/edit.component';
import { SeasonAttachComponent } from './season/attach.component';
import { LeagueListComponent } from './league/list.component';
import { LeagueEditComponent } from './league/edit.component';
import { LeagueAttachComponent } from './league/attach.component';
import { CompetitionListComponent } from './competition/list.component';
import { CompetitionEditComponent } from './competition/edit.component';
import { CompetitionAttachComponent } from './competition/attach.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthguardService] },
  { path: 'externalsources', component: ExternalSourceListComponent },
  { path: 'externalsource/:id', component: ExternalSourceEditComponent, canActivate: [AuthguardService] },

  { path: 'sports', component: SportListComponent, canActivate: [AuthguardService] },
  { path: 'sport/:id', component: SportEditComponent, canActivate: [AuthguardService] },
  { path: 'sport/attach/:id/:externalSourceId', component: SportAttachComponent, canActivate: [AuthguardService] },
  { path: 'associations', component: AssociationListComponent, canActivate: [AuthguardService] },
  { path: 'association/:id', component: AssociationEditComponent, canActivate: [AuthguardService] },
  { path: 'association/attach/:id/:externalSourceId', component: AssociationAttachComponent, canActivate: [AuthguardService] },
  { path: 'seasons', component: SeasonListComponent, canActivate: [AuthguardService] },
  { path: 'season/:id', component: SeasonEditComponent, canActivate: [AuthguardService] },
  { path: 'season/attach/:id/:externalSourceId', component: SeasonAttachComponent, canActivate: [AuthguardService] },
  { path: 'leagues', component: LeagueListComponent, canActivate: [AuthguardService] },
  { path: 'league/:id', component: LeagueEditComponent, canActivate: [AuthguardService] },
  { path: 'league/attach/:id/:externalSourceId', component: LeagueAttachComponent, canActivate: [AuthguardService] },
  { path: 'competitions', component: CompetitionListComponent, canActivate: [AuthguardService] },
  { path: 'competition/:id', component: CompetitionEditComponent, canActivate: [AuthguardService] },
  { path: 'competition/attach/:id/:externalSourceId', component: CompetitionAttachComponent, canActivate: [AuthguardService] },
  /*
  { path: 'competitor/:associationid', component: CompetitorListComponent, canActivate: [AuthguardService] },
  { path: 'competitor/edit/:associationid/:id', component: CompetitorEditComponent, canActivate: [AuthguardService] },
  { path: 'competitor/extern/:associationid/:id', component: CompetitorExternComponent, canActivate: [AuthguardService] },
  { path: 'pouleplace/edit/:competitionid/:id', component: PoulePlaceEditComponent, canActivate: [AuthguardService] },
  { path: 'structure/:id', component: StructureEditComponent, canActivate: [AuthguardService] },
  { path: 'games/:id', component: GameListComponent, canActivate: [AuthguardService] },
  { path: 'bookmaker', component: BookmakerListComponent, canActivate: [AuthguardService] },
  { path: 'bookmaker/edit/:id', component: BookmakerEditComponent, canActivate: [AuthguardService] },
  */

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes), ReactiveFormsModule],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
