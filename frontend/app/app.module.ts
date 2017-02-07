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
import { AssociationsComponent }  from './voetbal/components/associations';
import { AssociationRepository }  from './voetbal/repositories/association';
import { AssociationAddModalContent } from './voetbal/components/association/modal/add';
import { AssociationEditModalContent } from './voetbal/components/association/modal/edit';
import { ExternalSystemsComponent }  from './voetbal/components/external/systems';
import { ExternalSystemRepository }  from './voetbal/repositories/external/system';
import { ExternalSystemAddModalContent } from './voetbal/components/external/system/modal/add';
import { ExternalSystemEditModalContent } from './voetbal/components/external/system/modal/edit';

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
        RegisterComponent, ActivateComponent, LoginComponent, LogoutComponent, PasswordResetComponent, PasswordChangeComponent, UsersComponent,
        AssociationsComponent, AssociationAddModalContent, AssociationEditModalContent,
        ExternalSystemsComponent, ExternalSystemAddModalContent, ExternalSystemEditModalContent
    ],

    entryComponents: [
        AssociationAddModalContent, AssociationEditModalContent,
        ExternalSystemAddModalContent, ExternalSystemEditModalContent
    ],
    providers:    [
        AuthGuard,
        AuthenticationService,
        UserService,
        GlobalEventsManager,
        AssociationRepository,
        ExternalSystemRepository
    ],
    bootstrap:    [
        AppComponent
    ]
})

export class AppModule { }



