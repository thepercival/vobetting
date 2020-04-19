import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookmakerRepository } from '../../lib/bookmaker/repository';

import { IAlert } from '../../common/alert';
import { MyNavigation } from 'src/app/common/navigation';
import { ExternalObjectRepository } from 'src/app/lib/external/repository';
import { ExternalSourceRepository } from 'src/app/lib/external/source/repository';
import { ExternalSource } from 'src/app/lib/external/source';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExternalSourceSelectModalComponent } from '../externalsource/selectmodal.component';
import { AttacherRepository } from 'src/app/lib/attacher/repository';
import { JsonAttacher } from 'src/app/lib/attacher/mapper';
import { Bookmaker } from '../../lib/bookmaker';

@Component({
  selector: 'app-bookmaker-attach',
  templateUrl: './attach.component.html',
  styleUrls: ['./attach.component.css']
})
export class BookmakerAttachComponent implements OnInit {
  public alert: IAlert;
  public processing = true;
  public externalprocessing = false;
  bookmaker: Bookmaker;
  externalSource: ExternalSource;
  externalBookmakers: Bookmaker[];

  constructor(
    private bookmakerRepos: BookmakerRepository,
    private externalObjectRepos: ExternalObjectRepository,
    private externalSourceRepos: ExternalSourceRepository,
    private attacherRepos: AttacherRepository,
    private route: ActivatedRoute,
    protected myNavigation: MyNavigation,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.bookmakerRepos.getObject(+params.id)
        .subscribe(
        /* happy path */(bookmaker: Bookmaker) => {
            this.bookmaker = bookmaker;
          },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
        );

      this.externalSourceRepos.getObject(+params.externalSourceId)
        .subscribe(
        /* happy path */(externalSource: ExternalSource) => {
            this.externalSource = externalSource;
            this.updateExternalBookmakers();
          },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
        );
    });
  }

  protected updateExternalBookmakers() {
    this.externalprocessing = true;
    this.externalObjectRepos.getBookmakers(this.externalSource)
      .subscribe(
          /* happy path */(externalBookmakers: Bookmaker[]) => {
          this.externalBookmakers = externalBookmakers.sort((a, b) => a.getName() < b.getName() ? -1 : 0);
          this.externalprocessing = false;
        },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
      );
  }

  openExternalSource() {
    this.resetAlert();
    const modalRef = this.modalService.open(ExternalSourceSelectModalComponent);
    modalRef.componentInstance.showDeselect = false;
    modalRef.result.then((result) => {
      if (result instanceof ExternalSource) {
        this.externalSource = result;
        localStorage.setItem('externalSourceId', '' + result.getId());
        if (this.externalSource.hasBookmakerImplementation() === false) {
          this.setAlert('danger', 'deze externe bron heeft geen bookmakers');
          return;
        }
        this.processing = true;
        this.updateExternalBookmakers();
      }
    }, (reason) => {
    });
  }

  attach(externalBookmaker: Bookmaker) {
    this.processing = true;
    const json: JsonAttacher = {
      importableId: +this.bookmaker.getId(),
      externalId: '' + externalBookmaker.getId()
    };
    this.attacherRepos.createBookmaker(json, this.externalSource)
      .subscribe(
        /* happy path */() => {
          this.navigateBack();
        },
        /* error path */ e => { this.processing = false; this.setAlert('danger', e); },
        /* onComplete */() => { this.processing = false; }
      );
  }

  navigateBack() {
    this.myNavigation.back();
  }

  protected setAlert(type: string, message: string) {
    this.alert = { type, message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }
}

