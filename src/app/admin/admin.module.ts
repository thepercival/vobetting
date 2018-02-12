import { ExternalSystemListComponent } from './externalsystem/list.component';
import { ExternalSystemEditComponent } from './externalsystem/edit.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ExternalSystemRepository } from 'ngx-sport';
import { AdminRoutingModule } from './admin-routing.module';
import { HomeComponent } from './home/home.component';
import { UserRepository } from '../user/repository';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  declarations: [HomeComponent, ExternalSystemListComponent, ExternalSystemEditComponent, HomeComponent],
  providers: [UserRepository, ExternalSystemRepository]
})
export class AdminModule { }
