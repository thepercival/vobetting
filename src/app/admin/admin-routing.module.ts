import { AuthguardService } from '../auth/authguard.service';
import { ExternalSystemEditComponent } from './externalsystem/edit.component';
import { ExternalSystemListComponent } from './externalsystem/list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthguardService] },
  { path: 'externalsystem', component: ExternalSystemListComponent, canActivate: [AuthguardService] },
  { path: 'externalsystem/edit/:id', component: ExternalSystemEditComponent, canActivate: [AuthguardService] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
