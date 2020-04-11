import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Sport } from 'ngx-sport';
import { SportRepository } from '../../lib/ngx-sport/sport/repository';

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
  selector: 'app-sport-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class SportListComponent implements OnInit {

  sports: Sport[];
  alert: IAlert;
  processing = true;
  processingtaching = false;
  externalSource: ExternalSource;
  uiAttachers: SportAttacher[];

  constructor(
    private router: Router,
    private sportRepos: SportRepository,
    private attacherRepos: AttacherRepository,
    private externalObjectRepos: ExternalObjectRepository,
    private externalSourceRepos: ExternalSourceRepository,
    private myNavigation: MyNavigation,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.sportRepos.getObjects()
      .subscribe(
        /* happy path */(sports: Sport[]) => {
          this.sports = sports.sort((a, b) => a.getName() < b.getName() ? -1 : 0);
          const externalSourceId = localStorage.getItem('externalSourceId');
          if (externalSourceId) {
            this.externalSourceRepos.getObject(externalSourceId)
              .subscribe(
                /* happy path */(externalSource: ExternalSource) => {
                  this.externalSource = externalSource;
                  this.updateExternalSource();
                },
                /* error path */ e => { this.processing = false; this.setAlert('danger', e.message); },
                /* onComplete */() => { this.processing = false; }
              );
          } else {
            this.processing = false;
          }
        },
        /* error path */ e => { this.processing = false; this.setAlert('danger', e.message); },
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

    if (this.externalSource.hasSportImplementation() === false) {
      this.setAlert('danger', 'deze externe bron heeft geen sporten');
      return;
    }
    this.processing = true;
    this.getAttachers(this.externalSource);
  }


  protected getAttachers(externalSource: ExternalSource) {
    this.uiAttachers = [];
    this.attacherRepos.getSports(externalSource)
      .subscribe(
        /* happy path */(attachers) => {
          this.externalObjectRepos.getSports(externalSource)
            .subscribe(
            /* happy path */(externalSports: Sport[]) => {
                this.sports.forEach(sport => {
                  const attacher = this.externalSource.getSportAttacher(sport);
                  const externalSport = attacher ? externalSports.find(externalSportIt => {
                    return externalSportIt.getId() == attacher.getExternalId();
                  }) : undefined;
                  const uiAttacher: SportAttacher = { sport, attacher, externalSport };
                  this.uiAttachers.push(uiAttacher);
                });
              },
            /* error path */ e => { },
            /* onComplete */() => { this.processing = false; }
            );
        },
        /* error path */ e => { this.processing = false; this.setAlert('danger', e.message); },
        /* onComplete */() => { }
      );
  }

  hasAttacher(sport: Sport): boolean {
    return this.getAttacher(sport) !== undefined;
  }

  getAttacher(sport: Sport): Attacher {
    return this.externalSource.getSportAttacher(sport);
  }

  attach(sportAttacher: SportAttacher) {
    this.router.navigate(['/admin/sport/attach', sportAttacher.sport.getId(), this.externalSource.getId()]);
  }

  detach(sportAttacher: SportAttacher) {
    this.processingtaching = true;
    this.attacherRepos.removeSport(sportAttacher.attacher)
      .subscribe(
        /* happy path */() => {
          sportAttacher.externalSport = undefined;
        },
        /* error path */ e => { this.processingtaching = false; this.setAlert('danger', e.message); },
        /* onComplete */() => { this.processingtaching = false; }
      );
  }

  add() {
    this.linkToEdit();
  }

  edit(sport: Sport) {
    this.linkToEdit(sport);
  }

  linkToEdit(sport?: Sport) {
    this.router.navigate(['/admin/sport', sport ? sport.getId() : 0]);
  }

  remove(sport: Sport) {
    this.setAlert('info', 'sport verwijderen..');
    this.processing = true;

    this.sportRepos.removeObject(sport)
      .subscribe(
        /* happy path */ sportRes => {
          const index = this.sports.indexOf(sport);
          if (index > -1) {
            this.sports.splice(index, 1);
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

  // updateSportAttacher(sport: Sport) {
  //   const attacher = this.getSportAttacher(sport);
  //   if (attacher === undefined) {
  //     return;
  //   }
  //   attacher.setExternal(sport);
  // }
}

interface SportAttacher {
  sport: Sport;
  attacher: Attacher;
  externalSport: Sport;
}
