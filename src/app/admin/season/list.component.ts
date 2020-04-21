import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Season } from 'ngx-sport';
import { SeasonRepository } from '../../lib/ngx-sport/season/repository';

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
  selector: 'app-season-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class SeasonListComponent implements OnInit {

  seasons: Season[];
  alert: IAlert;
  processing = true;
  processingtaching = false;
  externalSource: ExternalSource;
  uiAttachers: SeasonAttacher[];

  constructor(
    private router: Router,
    private seasonRepos: SeasonRepository,
    private attacherRepos: AttacherRepository,
    private externalObjectRepos: ExternalObjectRepository,
    private externalSourceRepos: ExternalSourceRepository,
    private myNavigation: MyNavigation,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.seasonRepos.getObjects()
      .subscribe(
        /* happy path */(seasons: Season[]) => {
          this.seasons = seasons.sort((a, b) => a.getName() < b.getName() ? -1 : 0);
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

    if (this.externalSource.hasSeasonImplementation() === false) {
      this.setAlert('danger', 'deze externe bron heeft geen seizoenen');
      return;
    }
    this.processing = true;
    this.getAttachers(this.externalSource);
  }


  protected getAttachers(externalSource: ExternalSource) {
    this.uiAttachers = [];
    this.attacherRepos.getSeasons(externalSource)
      .subscribe(
        /* happy path */(attachers) => {
          this.externalObjectRepos.getSeasons(externalSource)
            .subscribe(
            /* happy path */(externalSeasons: Season[]) => {
                this.seasons.forEach(season => {
                  const attacher = this.externalSource.getSeasonAttacher(season);
                  const externalSeason = attacher ? externalSeasons.find(externalSeasonIt => {
                    // tslint:disable-next-line:triple-equals
                    return externalSeasonIt.getId() == attacher.getExternalId();
                  }) : undefined;
                  const uiAttacher: SeasonAttacher = { season, attacher, externalSeason };
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

  hasAttacher(season: Season): boolean {
    return this.getAttacher(season) !== undefined;
  }

  getAttacher(season: Season): Attacher {
    return this.externalSource.getSeasonAttacher(season);
  }

  attach(seasonAttacher: SeasonAttacher) {
    this.router.navigate(['/admin/season/attach', seasonAttacher.season.getId(), this.externalSource.getId()]);
  }

  detach(seasonAttacher: SeasonAttacher) {
    this.processingtaching = true;
    this.attacherRepos.removeSeason(seasonAttacher.attacher)
      .subscribe(
        /* happy path */() => {
          seasonAttacher.attacher = undefined;
          seasonAttacher.externalSeason = undefined;
        },
        /* error path */ e => { this.processingtaching = false; this.setAlert('danger', e); },
        /* onComplete */() => { this.processingtaching = false; }
      );
  }

  add() {
    this.linkToEdit();
  }

  edit(season: Season) {
    this.linkToEdit(season);
  }

  linkToEdit(season?: Season) {
    this.router.navigate(['/admin/season', season ? season.getId() : 0]);
  }

  remove(season: Season) {
    this.setAlert('info', 'seizoen verwijderen..');
    this.processing = true;

    this.seasonRepos.removeObject(season)
      .subscribe(
        /* happy path */ seasonRes => {
          const index = this.seasons.indexOf(season);
          if (index > -1) {
            this.seasons.splice(index, 1);
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

  // updateSeasonAttacher(season: Season) {
  //   const attacher = this.getSeasonAttacher(season);
  //   if (attacher === undefined) {
  //     return;
  //   }
  //   attacher.setExternal(season);
  // }
}

interface SeasonAttacher {
  season: Season;
  attacher: Attacher;
  externalSeason: Season;
}
