import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AssociationListComponent } from './association/list.component';
import { AssociationEditComponent } from './association/edit.component';
import { ExternalSystemEditComponent } from './externalsystem/edit.component';
import { ExternalSystemListComponent } from './externalsystem/list.component';


@NgModule({
  declarations: [AssociationListComponent, AssociationEditComponent, ExternalSystemEditComponent, ExternalSystemListComponent],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
