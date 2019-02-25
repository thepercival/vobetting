import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExternalSystem, ExternalSystemRepository } from 'ngx-sport';

import { IAlert } from '../../app.definitions';

@Component({
  selector: 'app-externalsystem-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ExternalSystemListComponent implements OnInit {

  externalSystems: ExternalSystem[];
  alert: IAlert;
  processing = true;

  constructor(
    private router: Router,
    private externalSystemRepos: ExternalSystemRepository
  ) { }

  ngOnInit() {
    this.externalSystemRepos.getObjects()
      .subscribe(
        /* happy path */(externalSystems: ExternalSystem[]) => {
          this.externalSystems = externalSystems;
          this.processing = false;
        },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
      );
  }

  add() {
    this.linkToEdit();
  }

  edit(externalSystem: ExternalSystem) {
    this.linkToEdit(externalSystem);
  }

  linkToEdit(externalSystem?: ExternalSystem) {
    this.router.navigate(
      ['/admin/externalsystem/edit', externalSystem ? externalSystem.getId() : 0],
      {
        queryParams: {
          returnAction: '/admin/externalsystem'
        }
      }
    );
  }

  remove(externalSystem: ExternalSystem) {
    this.setAlert('info', 'extern systeem verwijderen..');
    this.processing = true;

    this.externalSystemRepos.removeObject(externalSystem)
      .subscribe(
        /* happy path */ externalSystemRes => {
          const index = this.externalSystems.indexOf(externalSystem);
          if (index > -1) {
            this.externalSystems.splice(index, 1);
          }
          this.resetAlert();
        },
        /* error path */ e => { this.setAlert('danger', 'X' + e); this.processing = false; },
        /* onComplete */() => this.processing = false
      );
  }

  protected setAlert(type: string, message: string) {
    this.alert = { 'type': type, 'message': message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }

}
