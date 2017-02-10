import { NgModule } from '@angular/core';
import './rxjs-extensions';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { NgbModule }     from '@ng-bootstrap/ng-bootstrap';
import { HttpModule }    from '@angular/http';
import { AppRoutingModule }     from './app-routing.module';
import { NavbarComponent }   from './navbar/component';
import { AppComponent }   from './app.component';
import { FocusModule } from './_directives/focus.module';
import { HomeComponent } from './home/component';
import { AuthenticationService } from './auth/service';
import { AuthGuard } from './auth/guard';
import { UserService } from './user/service';
import { RegisterComponent }  from './user/register.component';
import { ActivateComponent }  from './user/activate.component';
import { LogoutComponent }  from './user/logout.component';
import { LoginComponent }  from './user/login.component';
import { UsersComponent }  from './user/users.component';
import { PasswordResetComponent, PasswordChangeComponent }  from './user/password.component';
import { GlobalEventsManager } from "./global-events-manager";
import { AdminComponent } from "./admin/component";
import { AssociationsComponent }  from './voetbal/components/associations';
import { AssociationRepository }  from './voetbal/repositories/association';
import { AssociationAddModalContent } from './voetbal/components/association/modal/add';
import { AssociationEditModalContent } from './voetbal/components/association/modal/edit';
import { CompetitionsComponent }  from './voetbal/components/competitions';
import { CompetitionRepository }  from './voetbal/repositories/competition';
import {CompetitionAddModalContent } from './voetbal/components/competition/modal/add';
import { CompetitionEditModalContent } from './voetbal/components/competition/modal/edit';
import { CompetitionsExternalComponent } from './voetbal/components/competition/external';

@NgModule({
   imports:      [
        BrowserModule,
        FormsModule,
        HttpModule,
        NgbModule.forRoot(),
        AppRoutingModule,
        FocusModule.forRoot()
    ],
    declarations: [
        AppComponent,
        NavbarComponent,
        HomeComponent,
        AdminComponent,
        RegisterComponent, ActivateComponent, LoginComponent, LogoutComponent, PasswordResetComponent, PasswordChangeComponent, UsersComponent,
        AssociationsComponent, AssociationAddModalContent, AssociationEditModalContent,
        CompetitionsComponent, CompetitionAddModalContent, CompetitionEditModalContent,
        CompetitionsExternalComponent
    ],

    entryComponents: [
        AssociationAddModalContent, AssociationEditModalContent,
        CompetitionAddModalContent, CompetitionEditModalContent
    ],
    providers:    [
        AuthGuard,
        AuthenticationService,
        UserService,
        GlobalEventsManager,
        AssociationRepository,
        CompetitionRepository
    ],
    bootstrap:    [
        AppComponent
    ]
})

export class AppModule { }



