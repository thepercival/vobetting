import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { UserRoutingModule } from './user-routing.module';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLevelUpAlt, faKey } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserRoutingModule,
    NgbAlertModule,
    FontAwesomeModule
  ],
  declarations: [LoginComponent]
})
export class UserModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faLevelUpAlt, faKey);
  }
}
