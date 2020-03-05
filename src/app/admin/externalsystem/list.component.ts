import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ExternalSystem } from 'ngx-sport';
import { ExternalSystemRepository } from '../../lib/ngx-sport/external/system/repository';
import { IAlert } from '../../common/alert';

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
    this.router.navigate( ['/admin/externalsystem', externalSystem ? externalSystem.getId() : 0] );
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
    this.alert = { type, message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }

}
