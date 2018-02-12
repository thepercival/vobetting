import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  AssociationRepository,
  CompetitionRepository,
  CompetitionseasonRepository,
  FieldRepository,
  RefereeRepository,
  SeasonRepository,
} from 'ngx-sport';

import { AdminModule } from './admin/admin.module';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { AuthguardService } from './auth/authguard.service';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { UserModule } from './user/user.module';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    UserModule,
    AdminModule/*,
    SportModule*/,
    NgbModule.forRoot()
  ],
  providers: [
    AuthService,
    AuthguardService,
    CompetitionseasonRepository,
    AssociationRepository,
    CompetitionRepository,
    SeasonRepository
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
