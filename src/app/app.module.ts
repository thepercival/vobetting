import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCalendarAlt,
  faCloudDownloadAlt,
  faLevelUpAlt,
  faPencilAlt,
  faPlus,
  faSignInAlt,
  faSignOutAlt,
  faSpinner,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  NgbAlertModule,
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbPopoverModule,
  NgbTimepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { AssociationRepository, CompetitionRepository, LeagueRepository, SeasonRepository } from 'ngx-sport';

import { AdminModule } from './admin/admin.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { AuthguardService } from './auth/authguard.service';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { UserModule } from './user/user.module';

library.add(faLevelUpAlt, faSpinner, faPlus, faSignInAlt,
  faSignOutAlt, faPencilAlt, faTrashAlt, faCalendarAlt, faCloudDownloadAlt);

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    UserModule,
    AdminModule/*,
    SportModule*/,
    NgbAlertModule.forRoot(), NgbCollapseModule.forRoot(), NgbDatepickerModule.forRoot(),
    NgbPopoverModule.forRoot(), NgbTimepickerModule.forRoot(),
    FontAwesomeModule
  ],
  providers: [
    AuthService,
    AuthguardService,
    CompetitionRepository,
    AssociationRepository,
    LeagueRepository,
    SeasonRepository
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
