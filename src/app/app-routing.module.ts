import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthguardService } from './auth/authguard.service';
import { HomeComponent } from './home/home.component';

// import { ActivateComponent }  from './user/activate.component';
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule' },
  { path: 'user', loadChildren: 'app/user/user.module#UserModule' },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
