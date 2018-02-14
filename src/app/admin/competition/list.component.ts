import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Competition, CompetitionRepository } from 'ngx-sport';

import { IAlert } from '../../app.definitions';

@Component({
  selector: 'app-competition-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class CompetitionListComponent implements OnInit {

  competitions: Competition[];
  alert: IAlert;
  processing = true;

  constructor(
    private router: Router,
    private competitionRepos: CompetitionRepository
  ) { }

  ngOnInit() {
    this.competitionRepos.getObjects()
      .subscribe(
        /* happy path */(competitions: Competition[]) => {
        this.competitions = competitions;
      },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
      );
  }

  add() {
    this.linkToEdit();
  }

  edit(competition: Competition) {
    this.linkToEdit(competition);
  }

  linkToEdit(competition?: Competition) {
    this.router.navigate(
      ['/admin/competition/edit', competition ? competition.getId() : 0],
      {
        queryParams: {
          returnAction: '/admin/competition'
        }
      }
    );
  }

  remove(competition: Competition) {
    this.setAlert('info', 'competitie verwijderen..');
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
    this.alert = { 'type': type, 'message': message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }

}
