import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AssociationListComponent } from './association/list.component';
import { AssociationEditComponent } from './association/edit.component';
import { ExternalSourceEditComponent } from './externalsource/edit.component';
import { ExternalSourceListComponent } from './externalsource/list.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  NgbAlertModule, NgbDatepickerModule, NgbTimepickerModule, NgbNavModule, NgbPopoverModule,
  NgbCollapseModule, NgbButtonsModule, NgbModalModule
} from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { ExternalSourceRepository } from '../lib/ngx-sport/external/system/repository';
import { AssociationMapper } from 'ngx-sport';
import { faTrashAlt, faCloud, faCompressAlt } from '@fortawesome/free-solid-svg-icons';
import { AssociationRepository } from '../lib/ngx-sport/association/repository';
import { ExternalSourceSelectModalComponent } from './externalsource/selectmodal.component';
import { ExternalSourceMapper } from '../lib/externalsource/source/mapper';


@NgModule({
  declarations: [ExternalSourceSelectModalComponent,
    AssociationListComponent, AssociationEditComponent, ExternalSourceEditComponent, ExternalSourceListComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FontAwesomeModule,
    NgbDatepickerModule, NgbTimepickerModule, NgbAlertModule, NgbPopoverModule, NgbCollapseModule, NgbModalModule, NgbButtonsModule,
    NgbNavModule,
    ReactiveFormsModule,
  ],
  entryComponents: [ExternalSourceSelectModalComponent],
  providers: [
    ExternalSourceRepository,
    ExternalSourceMapper,
    AssociationRepository,
    AssociationMapper
  ]
})
export class AdminModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faTrashAlt, faCloud, faCompressAlt);
  }
}
