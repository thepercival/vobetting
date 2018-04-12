import { BookmakerRepository } from '../../vobetting/bookmaker/repository';
import { Bookmaker } from '../../vobetting/bookmaker';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IAlert } from '../../app.definitions';

@Component({
  selector: 'app-bookmaker-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class BookmakerListComponent implements OnInit {

  bookmakers: Bookmaker[];
  alert: IAlert;
  processing = true;

  constructor(
    private router: Router,
    private bookmakerRepos: BookmakerRepository
  ) { }

  ngOnInit() {
    this.bookmakerRepos.getObjects()
      .subscribe(
        /* happy path */(bookmakers: Bookmaker[]) => {
          this.bookmakers = bookmakers;
        },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
      );
  }

  add() {
    this.linkToEdit();
  }

  edit(bookmaker: Bookmaker) {
    this.linkToEdit(bookmaker);
  }

  linkToEdit(bookmaker?: Bookmaker) {
    this.router.navigate(
      ['/admin/bookmaker/edit', bookmaker ? bookmaker.getId() : 0],
      {
        queryParams: {
          returnAction: '/admin/bookmaker'
        }
      }
    );
  }

  remove(bookmaker: Bookmaker) {
    this.setAlert('info', 'bookmaker verwijderen..');
    this.processing = true;

    this.bookmakerRepos.removeObject(bookmaker)
      .subscribe(
        /* happy path */ bookmakerRes => {
          const index = this.bookmakers.indexOf(bookmaker);
          if (index > -1) {
            this.bookmakers.splice(index, 1);
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
