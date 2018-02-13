import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthguardService } from '../auth/authguard.service';
import { ExternalSystemEditComponent } from './externalsystem/edit.component';
import { ExternalSystemListComponent } from './externalsystem/list.component';
import { HomeComponent } from './home/home.component';
import { SeasonEditComponent } from './season/edit.component';
import { SeasonListComponent } from './season/list.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthguardService] },
  { path: 'externalsystem', component: ExternalSystemListComponent, canActivate: [AuthguardService] },
  { path: 'externalsystem/edit/:id', component: ExternalSystemEditComponent, canActivate: [AuthguardService] },
  { path: 'season', component: SeasonListComponent, canActivate: [AuthguardService] },
  { path: 'season/edit/:id', component: SeasonEditComponent, canActivate: [AuthguardService] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
