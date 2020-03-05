import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AssociationListComponent } from './association/list.component';
import { AssociationEditComponent } from './association/edit.component';
import { ExternalSystemEditComponent } from './externalsystem/edit.component';
import { ExternalSystemListComponent } from './externalsystem/list.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  NgbAlertModule, NgbDatepickerModule, NgbTimepickerModule, NgbNavModule, NgbPopoverModule,
  NgbCollapseModule, NgbButtonsModule, NgbModalModule
} from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { ExternalSystemRepository } from '../lib/ngx-sport/external/system/repository';
import { ExternalSystem, ExternalSystemMapper } from 'ngx-sport';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';


@NgModule({
  declarations: [AssociationListComponent, AssociationEditComponent, ExternalSystemEditComponent, ExternalSystemListComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FontAwesomeModule,
    NgbDatepickerModule, NgbTimepickerModule, NgbAlertModule, NgbPopoverModule, NgbCollapseModule, NgbModalModule, NgbButtonsModule,
    NgbNavModule,
    ReactiveFormsModule,
  ],
  providers: [
    ExternalSystemRepository,
    ExternalSystemMapper
  ]
})
export class AdminModule { 
  constructor(library: FaIconLibrary) {
    library.addIcons(faTrashAlt);
  }
}
