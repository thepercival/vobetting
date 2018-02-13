import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExternalSystemRepository, SeasonRepository } from 'ngx-sport';

import { UserRepository } from '../user/repository';
import { AdminRoutingModule } from './admin-routing.module';
import { ExternalSystemEditComponent } from './externalsystem/edit.component';
import { ExternalSystemListComponent } from './externalsystem/list.component';
import { HomeComponent } from './home/home.component';
import { SeasonEditComponent } from './season/edit.component';
import { SeasonListComponent } from './season/list.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  declarations: [HomeComponent,
    ExternalSystemListComponent, ExternalSystemEditComponent,
    SeasonListComponent, SeasonEditComponent,
    HomeComponent],
  providers: [UserRepository, ExternalSystemRepository, SeasonRepository]
})
export class AdminModule { }
