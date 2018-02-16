import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Team, TeamRepository } from 'ngx-sport';

import { IAlert } from '../../app.definitions';

@Component({
  selector: 'app-team-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class TeamListComponent implements OnInit {

  teams: Team[];
  alert: IAlert;
  processing = true;

  constructor(
    private router: Router,
    private teamRepos: TeamRepository
  ) { }

  ngOnInit() {
    this.teamRepos.getObjects()
      .subscribe(
        /* happy path */(teams: Team[]) => {
        this.teams = teams;
      },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
      );
  }

  add() {
    this.linkToEdit();
  }

  edit(team: Team) {
    this.linkToEdit(team);
  }

  linkToEdit(team?: Team) {
    this.router.navigate(
      ['/admin/team/edit', team ? team.getId() : 0],
      {
        queryParams: {
          returnAction: '/admin/team'
        }
      }
    );
  }

  remove(team: Team) {
    this.setAlert('info', 'team verwijderen..');
    this.processing = true;

    this.teamRepos.removeObject(team)
      .subscribe(
        /* happy path */ teamRes => {
        const index = this.teams.indexOf(team);
        if (index > -1) {
          this.teams.splice(index, 1);
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
