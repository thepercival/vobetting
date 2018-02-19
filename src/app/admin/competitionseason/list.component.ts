import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Competitionseason, CompetitionseasonRepository } from 'ngx-sport';

import { IAlert } from '../../app.definitions';

@Component({
  selector: 'app-competitionseason-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class CompetitionseasonListComponent implements OnInit {

  competitionseasons: Competitionseason[];
  alert: IAlert;
  processing = true;

  constructor(
    private router: Router,
    private competitionseasonRepos: CompetitionseasonRepository
  ) { }

  ngOnInit() {
    this.competitionseasonRepos.getObjects()
      .subscribe(
        /* happy path */(competitionseasons: Competitionseason[]) => {
        this.competitionseasons = competitionseasons;
      },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
      );
  }

  add() {
    this.router.navigate(
      ['/admin/competitionseason/edit', 0],
      {
        queryParams: {
          returnAction: '/admin/competitionseason'
        }
      }
    );
  }

  edit(competitionseason: Competitionseason) {
    this.router.navigate(
      ['/admin/competitionseason/home', competitionseason.getId()],
      {
        queryParams: {
          returnAction: '/admin/competitionseason'
        }
      }
    );
  }

  remove(competitionseason: Competitionseason) {
    this.setAlert('info', 'competitie verwijderen..');
    this.processing = true;

    this.competitionseasonRepos.removeObject(competitionseason)
      .subscribe(
        /* happy path */ competitionseasonRes => {
        const index = this.competitionseasons.indexOf(competitionseason);
        if (index > -1) {
          this.competitionseasons.splice(index, 1);
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
