import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Association } from 'ngx-sport';
import { AssociationRepository } from '../../lib/ngx-sport/association/repository';

import { IAlert } from '../../common/alert';

@Component({
  selector: 'app-association-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class AssociationListComponent implements OnInit {

  associations: Association[];
  alert: IAlert;
  processing = true;

  constructor(
    private router: Router,
    private associationRepos: AssociationRepository
  ) { }

  ngOnInit() {
    this.associationRepos.getObjects()
      .subscribe(
        /* happy path */(associations: Association[]) => {
          this.associations = associations;
        },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
      );
  }

  add() {
    this.linkToEdit();
  }

  edit(association: Association) {
    this.linkToEdit(association);
  }

  linkToEdit(association?: Association) {
    this.router.navigate(
      ['/admin/association/edit', association ? association.getId() : 0],
      {
        queryParams: {
          returnAction: '/admin/association'
        }
      }
    );
  }

  remove(association: Association) {
    this.setAlert('info', 'bond verwijderen..');
    this.processing = true;

    this.associationRepos.removeObject(association)
      .subscribe(
        /* happy path */ associationRes => {
          const index = this.associations.indexOf(association);
          if (index > -1) {
            this.associations.splice(index, 1);
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
