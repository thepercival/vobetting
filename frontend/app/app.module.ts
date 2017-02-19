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
import { AssociationRepository }  from './voetbal/domain/association/repository';
import { AssociationAddModalContent } from './voetbal/components/association/modal/add';
import { AssociationEditModalContent } from './voetbal/components/association/modal/edit';
import { AssociationAddExternalModalContent } from './voetbal/components/association/modal/addexternal';
import { AssociationsExternalComponent } from './voetbal/components/association/external';
import { CompetitionsComponent }  from './voetbal/components/competitions';
import { CompetitionRepository }  from './voetbal/domain/competition/repository';
import { CompetitionAddModalContent } from './voetbal/components/competition/modal/add';
import { CompetitionEditModalContent } from './voetbal/components/competition/modal/edit';
import { CompetitionAddExternalModalContent } from './voetbal/components/competition/modal/addexternal';
import { CompetitionsExternalComponent } from './voetbal/components/competition/external';
import { SeasonsComponent }  from './voetbal/components/seasons';
import { SeasonRepository }  from './voetbal/domain/season/repository';
import { SeasonAddModalContent } from './voetbal/components/season/modal/add';
import { SeasonEditModalContent } from './voetbal/components/season/modal/edit';
import { CompetitionSeasonsComponent }  from './voetbal/components/competitionseasons';
import { CompetitionSeasonRepository }  from './voetbal/domain/competitionseason/repository';
import { CompetitionSeasonAddModalContent } from './voetbal/components/competitionseason/modal/add';
import { CompetitionSeasonEditModalContent } from './voetbal/components/competitionseason/modal/edit';
import { ExternalSystemsComponent }  from './voetbal/components/external/systems';
import { ExternalSystemRepository }  from './voetbal/domain/external/system/repository';
import { ExternalSystemAddModalContent } from './voetbal/components/external/system/modal/add';
import { ExternalSystemEditModalContent } from './voetbal/components/external/system/modal/edit';
import { ExternalObjectRepository }  from './voetbal/domain/external/object/repository';

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
        AssociationAddExternalModalContent, AssociationsExternalComponent,
        CompetitionsComponent, CompetitionAddModalContent, CompetitionEditModalContent,
        CompetitionAddExternalModalContent, CompetitionsExternalComponent,
        SeasonsComponent, SeasonAddModalContent, SeasonEditModalContent,
        CompetitionSeasonsComponent, CompetitionSeasonAddModalContent, CompetitionSeasonEditModalContent,
        ExternalSystemsComponent, ExternalSystemAddModalContent, ExternalSystemEditModalContent
    ],

    entryComponents: [
        AssociationAddModalContent, AssociationEditModalContent, AssociationAddExternalModalContent,
        CompetitionAddModalContent, CompetitionEditModalContent, CompetitionAddExternalModalContent,
        SeasonAddModalContent, SeasonEditModalContent,
        ExternalSystemAddModalContent, ExternalSystemEditModalContent,
        CompetitionSeasonAddModalContent, CompetitionSeasonEditModalContent
    ],
    providers:    [
        AuthGuard,
        AuthenticationService,
        UserService,
        GlobalEventsManager,
        AssociationRepository,
        CompetitionRepository,
        SeasonRepository,
        CompetitionSeasonRepository,
        ExternalSystemRepository,
        ExternalObjectRepository
    ],
    bootstrap:    [
        AppComponent
    ]
})

export class AppModule { }



