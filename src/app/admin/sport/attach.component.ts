import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SportRepository } from '../../lib/ngx-sport/sport/repository';

import { IAlert } from '../../common/alert';
import { MyNavigation } from 'src/app/common/navigation';
import { ExternalObjectRepository } from 'src/app/lib/external/repository';
import { ExternalSourceRepository } from 'src/app/lib/external/source/repository';
import { ExternalSource } from 'src/app/lib/external/source';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExternalSourceSelectModalComponent } from '../externalsource/selectmodal.component';
import { AttacherRepository } from 'src/app/lib/attacher/repository';
import { JsonAttacher } from 'src/app/lib/attacher/mapper';
import { Sport } from 'ngx-sport';

@Component({
  selector: 'app-sport-attach',
  templateUrl: './attach.component.html',
  styleUrls: ['./attach.component.css']
})
export class SportAttachComponent implements OnInit {
  public alert: IAlert;
  public processing = true;
  public externalprocessing = false;
  sport: Sport;
  externalSource: ExternalSource;
  externalSports: Sport[];

  constructor(
    private sportRepos: SportRepository,
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
      this.sportRepos.getObject(+params.id)
        .subscribe(
        /* happy path */(sport: Sport) => {
            this.sport = sport;
          },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
        );

      this.externalSourceRepos.getObject(+params.externalSourceId)
        .subscribe(
        /* happy path */(externalSource: ExternalSource) => {
            this.externalSource = externalSource;
            this.updateExternalSports();
          },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
        );
    });
  }

  protected updateExternalSports() {
    this.externalprocessing = true;
    this.externalObjectRepos.getSports(this.externalSource)
      .subscribe(
          /* happy path */(externalSports: Sport[]) => {
          this.externalSports = externalSports.sort((a, b) => a.getName() < b.getName() ? -1 : 0);
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
        if (this.externalSource.hasSportImplementation() === false) {
          this.setAlert('danger', 'deze externe bron heeft geen sporten');
          return;
        }
        this.processing = true;
        this.updateExternalSports();
      }
    }, (reason) => {
    });
  }

  attach(externalSport: Sport) {
    this.processing = true;
    const json: JsonAttacher = {
      importableId: +this.sport.getId(),
      externalId: '' + externalSport.getId()
    };
    this.attacherRepos.createSport(json, this.externalSource)
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

