import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthguardService } from '../auth/authguard.service';
import { BetGameComponent } from './betgames/betgame.component';
import { BetGameListComponent } from './betgames/betgamelist.component';


const routes: Routes = [
  { path: 'betgames', component: BetGameListComponent, canActivate: [AuthguardService] },
  { path: 'betgame/:competitionId/:gameId', component: BetGameComponent, canActivate: [AuthguardService] },
  { path: '', redirectTo: '/betgames', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VOBettingRoutingModule { }
