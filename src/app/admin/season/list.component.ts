import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Season, SeasonRepository } from 'ngx-sport';

import { IAlert } from '../../app.definitions';

@Component({
  selector: 'app-season-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class SeasonListComponent implements OnInit {

  seasons: Season[];
  alert: IAlert;
  processing = true;

  constructor(
    private router: Router,
    private seasonRepos: SeasonRepository
  ) { }

  ngOnInit() {
    this.seasonRepos.getObjects()
      .subscribe(
        /* happy path */(seasons: Season[]) => {
        this.seasons = seasons;
      },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
      );
  }

  add() {
    this.linkToEdit();
  }

  edit(season: Season) {
    this.linkToEdit(season);
  }

  linkToEdit(season?: Season) {
    this.router.navigate(
      ['/admin/season/edit', season ? season.getId() : 0],
      {
        queryParams: {
          returnAction: '/admin/season'
        }
      }
    );
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
    this.alert = { 'type': type, 'message': message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }

}
