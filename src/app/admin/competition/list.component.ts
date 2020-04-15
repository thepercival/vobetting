import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Competition } from 'ngx-sport';
import { CompetitionRepository } from '../../lib/ngx-sport/competition/repository';

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
  selector: 'app-competition-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class CompetitionListComponent implements OnInit {

  competitions: Competition[];
  alert: IAlert;
  processing = true;
  processingtaching = false;
  externalSource: ExternalSource;
  uiAttachers: CompetitionAttacher[];

  constructor(
    private router: Router,
    private competitionRepos: CompetitionRepository,
    private attacherRepos: AttacherRepository,
    private externalObjectRepos: ExternalObjectRepository,
    private externalSourceRepos: ExternalSourceRepository,
    private myNavigation: MyNavigation,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.competitionRepos.getObjects()
      .subscribe(
        /* happy path */(competitions: Competition[]) => {
          this.competitions = competitions.sort((a, b) => a.getName() < b.getName() ? -1 : 0);
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

    if (this.externalSource.hasCompetitionImplementation() === false) {
      this.setAlert('danger', 'deze externe bron heeft geen competities');
      return;
    }
    this.processing = true;
    this.getAttachers(this.externalSource);
  }


  protected getAttachers(externalSource: ExternalSource) {
    this.uiAttachers = [];
    this.attacherRepos.getCompetitions(externalSource)
      .subscribe(
        /* happy path */(attachers) => {
          this.externalObjectRepos.getCompetitions(externalSource)
            .subscribe(
            /* happy path */(externalCompetitions: Competition[]) => {
                this.competitions.forEach(competition => {
                  const attacher = this.externalSource.getCompetitionAttacher(competition);
                  const externalCompetition = attacher ? externalCompetitions.find(externalCompetitionIt => {
                    // tslint:disable-next-line:triple-equals
                    return externalCompetitionIt.getId() == attacher.getExternalId();
                  }) : undefined;
                  const uiAttacher: CompetitionAttacher = { competition, attacher, externalCompetition };
                  this.uiAttachers.push(uiAttacher);
                });
                console.log(this.uiAttachers);
              },
            /* error path */ e => { },
            /* onComplete */() => { this.processing = false; }
            );
        },
        /* error path */ e => { this.processing = false; this.setAlert('danger', e); },
        /* onComplete */() => { }
      );
  }

  hasAttacher(competition: Competition): boolean {
    return this.getAttacher(competition) !== undefined;
  }

  getAttacher(competition: Competition): Attacher {
    return this.externalSource.getCompetitionAttacher(competition);
  }

  attach(competitionAttacher: CompetitionAttacher) {
    this.router.navigate(['/admin/competition/attach', competitionAttacher.competition.getId(), this.externalSource.getId()]);
  }

  detach(competitionAttacher: CompetitionAttacher) {
    this.processingtaching = true;
    this.attacherRepos.removeCompetition(competitionAttacher.attacher)
      .subscribe(
        /* happy path */() => {
          competitionAttacher.externalCompetition = undefined;
        },
        /* error path */ e => { this.processingtaching = false; this.setAlert('danger', e); },
        /* onComplete */() => { this.processingtaching = false; }
      );
  }

  add() {
    this.linkToEdit();
  }

  edit(competition: Competition) {
    this.linkToEdit(competition);
  }

  linkToEdit(competition?: Competition) {
    if (competition) {
      this.router.navigate(['/admin/competition', competition.getId()]);
    } else {
      this.router.navigate(['/admin/competition']);
    }
  }

  remove(competition: Competition) {
    this.setAlert('info', 'competities verwijderen..');
    this.processing = true;

    this.competitionRepos.removeObject(competition)
      .subscribe(
        /* happy path */ competitionRes => {
          const index = this.competitions.indexOf(competition);
          if (index > -1) {
            this.competitions.splice(index, 1);
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

  // updateCompetitionAttacher(competition: Competition) {
  //   const attacher = this.getCompetitionAttacher(competition);
  //   if (attacher === undefined) {
  //     return;
  //   }
  //   attacher.setExternal(competition);
  // }
}

interface CompetitionAttacher {
  competition: Competition;
  attacher: Attacher;
  externalCompetition: Competition;
}
