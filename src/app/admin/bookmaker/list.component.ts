import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Bookmaker } from '../../lib/bookmaker';
import { BookmakerRepository } from '../../lib/bookmaker/repository';

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
  selector: 'app-bookmaker-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class BookmakerListComponent implements OnInit {

  bookmakers: Bookmaker[];
  alert: IAlert;
  processing = true;
  processingtaching = false;
  externalSource: ExternalSource;
  uiAttachers: BookmakerAttacher[];

  constructor(
    private router: Router,
    private bookmakerRepos: BookmakerRepository,
    private attacherRepos: AttacherRepository,
    private externalObjectRepos: ExternalObjectRepository,
    private externalSourceRepos: ExternalSourceRepository,
    private myNavigation: MyNavigation,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.bookmakerRepos.getObjects()
      .subscribe(
        /* happy path */(bookmakers: Bookmaker[]) => {
          this.bookmakers = bookmakers.sort((a, b) => a.getName() < b.getName() ? -1 : 0);
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

    if (this.externalSource.hasBookmakerImplementation() === false) {
      this.setAlert('danger', 'deze externe bron heeft geen bookmakers');
      return;
    }
    this.processing = true;
    this.getAttachers(this.externalSource);
  }


  protected getAttachers(externalSource: ExternalSource) {
    this.uiAttachers = [];
    this.attacherRepos.getBookmakers(externalSource)
      .subscribe(
        /* happy path */(attachers) => {
          this.externalObjectRepos.getBookmakers(externalSource)
            .subscribe(
            /* happy path */(externalBookmakers: Bookmaker[]) => {
                this.bookmakers.forEach(bookmaker => {
                  const attacher = this.externalSource.getBookmakerAttacher(bookmaker);
                  const externalBookmaker = attacher ? externalBookmakers.find(externalBookmakerIt => {
                    // tslint:disable-next-line:triple-equals
                    return externalBookmakerIt.getId() == attacher.getExternalId();
                  }) : undefined;
                  const uiAttacher: BookmakerAttacher = { bookmaker, attacher, externalBookmaker };
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

  hasAttacher(bookmaker: Bookmaker): boolean {
    return this.getAttacher(bookmaker) !== undefined;
  }

  getAttacher(bookmaker: Bookmaker): Attacher {
    return this.externalSource.getBookmakerAttacher(bookmaker);
  }

  attach(bookmakerAttacher: BookmakerAttacher) {
    console.log(bookmakerAttacher);
    this.router.navigate(['/admin/bookmaker/attach', bookmakerAttacher.bookmaker.getId(), this.externalSource.getId()]);
  }

  detach(bookmakerAttacher: BookmakerAttacher) {
    this.processingtaching = true;
    this.attacherRepos.removeBookmaker(bookmakerAttacher.attacher)
      .subscribe(
        /* happy path */() => {
          bookmakerAttacher.externalBookmaker = undefined;
        },
        /* error path */ e => { this.processingtaching = false; this.setAlert('danger', e); },
        /* onComplete */() => { this.processingtaching = false; }
      );
  }

  add() {
    this.linkToEdit();
  }

  edit(bookmaker: Bookmaker) {
    this.linkToEdit(bookmaker);
  }

  linkToEdit(bookmaker?: Bookmaker) {
    this.router.navigate(['/admin/bookmaker', bookmaker ? bookmaker.getId() : 0]);
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
    this.alert = { type, message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }

  navigateBack() {
    this.myNavigation.back();
  }

  // updateBookmakerAttacher(bookmaker: Bookmaker) {
  //   const attacher = this.getBookmakerAttacher(bookmaker);
  //   if (attacher === undefined) {
  //     return;
  //   }
  //   attacher.setExternal(bookmaker);
  // }
}

interface BookmakerAttacher {
  bookmaker: Bookmaker;
  attacher: Attacher;
  externalBookmaker: Bookmaker;
}
