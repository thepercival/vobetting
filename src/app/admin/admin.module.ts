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
import { AssociationMapper, SportMapper } from 'ngx-sport';
import { faTrashAlt, faCloud, faCompressAlt, faExpandAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { AssociationRepository } from '../lib/ngx-sport/association/repository';
import { ExternalSourceSelectModalComponent } from './externalsource/selectmodal.component';
import { ExternalSourceRepository } from '../lib/external/source/repository';
import { ExternalSourceMapper } from '../lib/external/source/mapper';
import { AttacherRepository } from '../lib/attacher/repository';
import { AttacherMapper } from '../lib/attacher/mapper';
import { ExternalObjectRepository } from '../lib/external/repository';
import { AssociationAttachComponent } from './association/attach.component';
import { SportListComponent } from './sport/list.component';
import { SportEditComponent } from './sport/edit.component';
import { SportAttachComponent } from './sport/attach.component';
import { SportRepository } from '../lib/ngx-sport/sport/repository';


@NgModule({
  declarations: [ExternalSourceSelectModalComponent,
    AssociationListComponent, AssociationEditComponent, AssociationAttachComponent,
    SportListComponent, SportEditComponent, SportAttachComponent,
    ExternalSourceEditComponent, ExternalSourceListComponent],
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
    AttacherRepository,
    AttacherMapper,
    ExternalObjectRepository,
    ExternalSourceRepository,
    ExternalSourceMapper,
    AssociationRepository,
    AssociationMapper,
    SportRepository,
    SportMapper
  ]
})
export class AdminModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faTrashAlt, faCloud, faCompressAlt, faExpandAlt, faCheckCircle);
  }
}
