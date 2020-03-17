import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Association } from 'ngx-sport';
import { AssociationRepository } from '../../lib/ngx-sport/association/repository';

import { IAlert } from '../../common/alert';
import { MyNavigation } from 'src/app/common/navigation';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExternalSourceSelectModalComponent } from '../externalsource/selectmodal.component';
import { ExternalSource } from 'src/app/lib/externalsource';

@Component({
  selector: 'app-association-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class AssociationListComponent implements OnInit {

  associations: Association[];
  alert: IAlert;
  processing = true;
  externalSource: ExternalSource;

  constructor(
    private router: Router,
    private associationRepos: AssociationRepository,
    private myNavigation: MyNavigation,
    private modalService: NgbModal
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

  openExternalSource() {
    this.resetAlert();
    const modalRef = this.modalService.open(ExternalSourceSelectModalComponent);
    modalRef.componentInstance.showDeselect = (this.externalSource !== undefined);
    modalRef.result.then((result) => {
      if (result instanceof ExternalSource) {
        this.externalSource = result;
        if (this.hasImplementation() === false) {
          this.setAlert('danger', 'deze externe bron heeft geen bonden');
        }
      } else {
        this.externalSource = undefined;
      }
    }, (reason) => {
    });
  }

  hasImplementation(): boolean {
    return this.externalSource.hasImplementation(ExternalSource.ASSOCIATION);
  }

  add() {
    this.linkToEdit();
  }

  edit(association: Association) {
    this.linkToEdit(association);
  }

  linkToEdit(association?: Association) {
    this.router.navigate(['/admin/association', association ? association.getId() : 0]);
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

  navigateBack() {
    this.myNavigation.back();
  }

}
