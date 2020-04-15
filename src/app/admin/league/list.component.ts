import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { League } from 'ngx-sport';
import { LeagueRepository } from '../../lib/ngx-sport/league/repository';

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
  selector: 'app-league-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class LeagueListComponent implements OnInit {

  leagues: League[];
  alert: IAlert;
  processing = true;
  processingtaching = false;
  externalSource: ExternalSource;
  uiAttachers: LeagueAttacher[];

  constructor(
    private router: Router,
    private leagueRepos: LeagueRepository,
    private attacherRepos: AttacherRepository,
    private externalObjectRepos: ExternalObjectRepository,
    private externalSourceRepos: ExternalSourceRepository,
    private myNavigation: MyNavigation,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.leagueRepos.getObjects()
      .subscribe(
        /* happy path */(leagues: League[]) => {
          this.leagues = leagues.sort((a, b) => a.getName() < b.getName() ? -1 : 0);
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

    if (this.externalSource.hasLeagueImplementation() === false) {
      this.setAlert('danger', 'deze externe bron heeft geen leagues');
      return;
    }
    this.processing = true;
    this.getAttachers(this.externalSource);
  }


  protected getAttachers(externalSource: ExternalSource) {
    this.uiAttachers = [];
    this.attacherRepos.getLeagues(externalSource)
      .subscribe(
        /* happy path */(attachers) => {
          this.externalObjectRepos.getLeagues(externalSource)
            .subscribe(
            /* happy path */(externalLeagues: League[]) => {
                this.leagues.forEach(league => {
                  const attacher = this.externalSource.getLeagueAttacher(league);
                  const externalLeague = attacher ? externalLeagues.find(externalLeagueIt => {
                    // tslint:disable-next-line:triple-equals
                    return externalLeagueIt.getId() == attacher.getExternalId();
                  }) : undefined;
                  const uiAttacher: LeagueAttacher = { league, attacher, externalLeague };
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

  hasAttacher(league: League): boolean {
    return this.getAttacher(league) !== undefined;
  }

  getAttacher(league: League): Attacher {
    return this.externalSource.getLeagueAttacher(league);
  }

  attach(leagueAttacher: LeagueAttacher) {
    this.router.navigate(['/admin/league/attach', leagueAttacher.league.getId(), this.externalSource.getId()]);
  }

  detach(leagueAttacher: LeagueAttacher) {
    this.processingtaching = true;
    this.attacherRepos.removeLeague(leagueAttacher.attacher)
      .subscribe(
        /* happy path */() => {
          leagueAttacher.externalLeague = undefined;
        },
        /* error path */ e => { this.processingtaching = false; this.setAlert('danger', e); },
        /* onComplete */() => { this.processingtaching = false; }
      );
  }

  add() {
    this.linkToEdit();
  }

  edit(league: League) {
    this.linkToEdit(league);
  }

  linkToEdit(league?: League) {
    this.router.navigate(['/admin/league', league ? league.getId() : 0]);
  }

  remove(league: League) {
    this.setAlert('info', 'leagues verwijderen..');
    this.processing = true;

    this.leagueRepos.removeObject(league)
      .subscribe(
        /* happy path */ leagueRes => {
          const index = this.leagues.indexOf(league);
          if (index > -1) {
            this.leagues.splice(index, 1);
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

  // updateLeagueAttacher(league: League) {
  //   const attacher = this.getLeagueAttacher(league);
  //   if (attacher === undefined) {
  //     return;
  //   }
  //   attacher.setExternal(league);
  // }
}

interface LeagueAttacher {
  league: League;
  attacher: Attacher;
  externalLeague: League;
}
