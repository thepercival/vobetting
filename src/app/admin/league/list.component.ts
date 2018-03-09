import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { League, LeagueRepository, SportConfig } from 'ngx-sport';

import { IAlert } from '../../app.definitions';

@Component({
  selector: 'app-league-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class LeagueListComponent implements OnInit {

  leagues: League[];
  alert: IAlert;
  processing = true;
  useExternal = SportConfig.useExternal;

  constructor(
    private router: Router,
    private leagueRepos: LeagueRepository
  ) { }

  ngOnInit() {
    this.leagueRepos.getObjects()
      .subscribe(
        /* happy path */(leagues: League[]) => {
        this.leagues = leagues;
      },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
      );
  }

  add() {
    this.linkToEdit();
  }

  edit(league: League) {
    this.linkToEdit(league);
  }

  linkToEdit(league?: League) {
    this.router.navigate(
      ['/admin/league/edit', league ? league.getId() : 0],
      {
        queryParams: {
          returnAction: '/admin/league'
        }
      }
    );
  }

  linkToExtern(league: League) {
    this.router.navigate(
      ['/admin/league/extern', league.getId()],
      {
        queryParams: {
          returnAction: '/admin/league'
        }
      }
    );
  }

  remove(league: League) {
    this.setAlert('info', 'league verwijderen..');
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
    this.alert = { 'type': type, 'message': message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }

}
