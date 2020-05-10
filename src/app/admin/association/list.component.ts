import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Association } from 'ngx-sport';
import { AssociationRepository } from '../../lib/ngx-sport/association/repository';

import { IAlert } from '../../common/alert';
import { MyNavigation } from 'src/app/common/navigation';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExternalSourceSelectModalComponent } from '../externalsource/selectmodal.component';
import { ExternalSource } from 'src/app/lib/external/source';
import { AttacherRepository } from 'src/app/lib/attacher/repository';
import { Attacher } from 'src/app/lib/attacher';
import { ExternalObjectRepository } from 'src/app/lib/external/repository';
import { ExternalSourceRepository } from 'src/app/lib/external/source/repository';

@Component({
  selector: 'app-association-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class AssociationListComponent implements OnInit {

  associations: Association[];
  alert: IAlert;
  processing = true;
  processingtaching = false;
  externalSource: ExternalSource;
  uiAttachers: AssociationAttacher[];

  constructor(
    private router: Router,
    private associationRepos: AssociationRepository,
    private attacherRepos: AttacherRepository,
    private externalObjectRepos: ExternalObjectRepository,
    private externalSourceRepos: ExternalSourceRepository,
    private myNavigation: MyNavigation,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.associationRepos.getObjects()
      .subscribe(
        /* happy path */(associations: Association[]) => {
          this.associations = associations.sort((a, b) => a.getName() < b.getName() ? -1 : 0);
          console.log("associations", this.associations);
          const externalSourceId = localStorage.getItem('externalSourceId');
          if (externalSourceId) {
            this.externalSourceRepos.getObject(externalSourceId)
              .subscribe(
                /* happy path */(externalSource: ExternalSource) => {
                  this.externalSource = externalSource;
                  this.updateExternalSource();
                },
                /* error path */ e => { this.processing = false; this.setAlert('danger', e); },
                /* onComplete */() => { this.processing = false; }
              );
          } else {
            this.processing = false;
          }
        },
        /* error path */ e => { this.processing = false; this.setAlert('danger', e); },
        /* onComplete */() => { }
      );
  }

  openExternalSource() {
    this.resetAlert();
    const modalRef = this.modalService.open(ExternalSourceSelectModalComponent);
    modalRef.componentInstance.showDeselect = (this.externalSource !== undefined);
    modalRef.result.then((result) => {
      if (result instanceof ExternalSource) {
        this.externalSource = result;
        localStorage.setItem('externalSourceId', '' + result.getId());
        this.updateExternalSource();
      } else {
        localStorage.removeItem('externalSourceId');
        this.externalSource = undefined;
      }
    }, (reason) => {
    });
  }

  updateExternalSource() {

    if (this.externalSource.hasAssociationImplementation() === false) {
      this.setAlert('danger', 'deze externe bron heeft geen bonden');
      return;
    }
    this.processing = true;
    this.getAttachers(this.externalSource);
  }


  protected getAttachers(externalSource: ExternalSource) {
    this.uiAttachers = [];
    this.attacherRepos.getAssociations(externalSource)
      .subscribe(
        /* happy path */(attachers) => {
          this.externalObjectRepos.getAssociations(externalSource)
            .subscribe(
            /* happy path */(externalAssociations: Association[]) => {
                console.log("externalAssociations", externalAssociations);
                this.associations.forEach(association => {
                  const attacher = this.externalSource.getAssociationAttacher(association);
                  const externalAssociation = attacher ? externalAssociations.find(externalAssociationIt => {
                    return externalAssociationIt.getId() == attacher.getExternalId();
                  }) : undefined;
                  const uiAttacher: AssociationAttacher = { association, attacher, externalAssociation };
                  this.uiAttachers.push(uiAttacher);
                });
              },
            /* error path */ e => { },
            /* onComplete */() => { this.processing = false; }
            );
        },
        /* error path */ e => { this.processing = false; this.setAlert('danger', e); },
        /* onComplete */() => { }
      );
  }

  hasAttacher(association: Association): boolean {
    return this.getAttacher(association) !== undefined;
  }

  getAttacher(association: Association): Attacher {
    return this.externalSource.getAssociationAttacher(association);
  }

  attach(associationAttacher: AssociationAttacher) {
    this.router.navigate(['/admin/association/attach', associationAttacher.association.getId(), this.externalSource.getId()]);
  }

  detach(associationAttacher: AssociationAttacher) {
    this.processingtaching = true;
    this.attacherRepos.removeAssociation(associationAttacher.attacher)
      .subscribe(
        /* happy path */() => {
          associationAttacher.attacher = undefined;
          associationAttacher.externalAssociation = undefined;
        },
        /* error path */ e => { this.processingtaching = false; this.setAlert('danger', e); },
        /* onComplete */() => { this.processingtaching = false; }
      );
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

  // updateAssociationAttacher(association: Association) {
  //   const attacher = this.getAssociationAttacher(association);
  //   if (attacher === undefined) {
  //     return;
  //   }
  //   attacher.setExternal(association);
  // }
}

interface AssociationAttacher {
  association: Association;
  attacher: Attacher;
  externalAssociation: Association;
}
