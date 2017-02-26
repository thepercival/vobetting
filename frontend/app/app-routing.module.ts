import { RouterModule, Routes } from '@angular/router';
import { NgModule }             from '@angular/core';
import { HomeComponent }   from './home/component';
import { RegisterComponent }  from './user/register.component';
import { ActivateComponent }  from './user/activate.component';
import { LoginComponent }  from './user/login.component';
import { LogoutComponent }  from './user/logout.component';
import { PasswordResetComponent, PasswordChangeComponent }  from './user/password.component';
import { UsersComponent }  from './user/users.component';
import { AdminComponent }  from './admin/component';
import { AssociationsComponent }  from './voetbal/components/associations';
import { AssociationsExternalComponent }  from './voetbal/components/association/external';
import { CompetitionsComponent }  from './voetbal/components/competitions';
import { CompetitionsExternalComponent }  from './voetbal/components/competition/external';
import { SeasonsComponent }  from './voetbal/components/seasons';
import { SeasonsExternalComponent }  from './voetbal/components/season/external';
import { CompetitionSeasonsComponent }  from './voetbal/components/competitionseasons';
import { CompetitionSeasonsExternalComponent }  from './voetbal/components/competitionseason/external';
import { TeamsComponent }  from './voetbal/components/teams';
import { TeamsExternalComponent }  from './voetbal/components/team/external';
import { ExternalSystemsComponent }  from './voetbal/components/external/systems';
import { AuthGuard }  from './auth/guard';
const routes: Routes = [
    { path: 'home',  component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'activate', component: ActivateComponent },
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'passwordreset', component: PasswordResetComponent },
    { path: 'passwordchange', component: PasswordChangeComponent },
    { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
    { path: 'associations', component: AssociationsComponent, canActivate: [AuthGuard] },
    { path: 'associations/external', component: AssociationsExternalComponent, canActivate: [AuthGuard] },
    { path: 'competitions', component: CompetitionsComponent, canActivate: [AuthGuard] },
    { path: 'competitions/external', component: CompetitionsExternalComponent, canActivate: [AuthGuard] },
    { path: 'seasons', component: SeasonsComponent, canActivate: [AuthGuard] },
    { path: 'seasons/external', component: SeasonsExternalComponent, canActivate: [AuthGuard] },
    { path: 'externalsystems', component: ExternalSystemsComponent, canActivate: [AuthGuard] },
    { path: 'competitionseasons', component: CompetitionSeasonsComponent, canActivate: [AuthGuard] },
    { path: 'competitionseasons/external', component: CompetitionSeasonsExternalComponent, canActivate: [AuthGuard] },
    { path: 'teams', component: TeamsComponent, canActivate: [AuthGuard] },
    { path: 'teams/external', component: TeamsExternalComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];
@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
