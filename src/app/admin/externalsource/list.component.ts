import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ExternalSource } from 'ngx-sport';
import { ExternalSourceRepository } from '../../lib/ngx-sport/external/system/repository';
import { IAlert } from '../../common/alert';

@Component({
  selector: 'app-externalsource-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ExternalSourceListComponent implements OnInit {

  externalSources: ExternalSource[];
  alert: IAlert;
  processing = true;

  constructor(
    private router: Router,
    private externalSourceRepos: ExternalSourceRepository
  ) { }

  ngOnInit() {
    this.externalSourceRepos.getObjects()
      .subscribe(
        /* happy path */(externalSources: ExternalSource[]) => {
          this.externalSources = externalSources;
          this.processing = false;
        },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
      );
  }

  add() {
    this.linkToEdit();
  }

  edit(externalSource: ExternalSource) {
    this.linkToEdit(externalSource);
  }

  linkToEdit(externalSource?: ExternalSource) {
    this.router.navigate(['/admin/externalsource', externalSource ? externalSource.getId() : 0]);
  }

  remove(externalSource: ExternalSource) {
    this.setAlert('info', 'extern systeem verwijderen..');
    this.processing = true;

    this.externalSourceRepos.removeObject(externalSource)
      .subscribe(
        /* happy path */ externalSourceRes => {
          const index = this.externalSources.indexOf(externalSource);
          if (index > -1) {
            this.externalSources.splice(index, 1);
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
