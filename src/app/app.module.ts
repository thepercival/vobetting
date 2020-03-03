import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AuthService } from './auth/auth.service';
import { AuthguardService } from './auth/authguard.service';
import { GlobalEventsManager } from './common/eventmanager';
import { MyNavigation } from './common/navigation';
import { CommonSharedModule } from './common/shared.module';
import { NgbDatepickerModule, NgbTimepickerModule, NgbAlertModule, NgbPopoverModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';

import {
  faAngleDoubleDown,
  faBasketballBall,
  faCalendarAlt,
  faChess,
  faClipboardCheck,
  faCopyright,
  faEnvelope,
  faEye,
  faFilter,
  faFutbol,
  faGamepad,
  faLevelUpAlt,
  faMobileAlt,
  faPencilAlt,
  faPlus,
  faPlusCircle,
  faSave,
  faSearch,
  faShareAlt,
  faSignInAlt,
  faSignOutAlt,
  faSpinner,
  faTableTennis,
  faTv,
  faUserCircle,
  faUserFriends,
  faUserShield,
  faVolleyballBall
} from '@fortawesome/free-solid-svg-icons';

import { faTwitter } from '@fortawesome/free-brands-svg-icons';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonSharedModule,
    NgbDatepickerModule, NgbTimepickerModule, NgbAlertModule, NgbPopoverModule, NgbCollapseModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    FontAwesomeModule
  ],
  providers: [
    AuthService,
    AuthguardService,
    GlobalEventsManager,
    MyNavigation,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faLevelUpAlt, faSpinner, faUserCircle, faFilter, faPencilAlt, faSave,
      faSignInAlt, faSignOutAlt, faPlusCircle, faPlus, faTv, faFutbol, faTableTennis, faSearch,
      faMobileAlt, faEnvelope, faCopyright, faEye, faShareAlt, faClipboardCheck,
      faGamepad, faBasketballBall, faChess, faVolleyballBall, faUserShield, faUserFriends, faCalendarAlt,
      faAngleDoubleDown);
    library.addIcons(
      faTwitter
    );
  }
}
