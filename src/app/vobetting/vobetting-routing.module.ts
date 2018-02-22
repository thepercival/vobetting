import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthguardService } from '../auth/authguard.service';
import { BetLineMainComponent } from './betline/main.component';


const routes: Routes = [
  { path: 'betline', component: BetLineMainComponent, canActivate: [AuthguardService] },
  { path: '', redirectTo: '/betline', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VOBettingRoutingModule { }
