import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeasonRepository } from '../../lib/ngx-sport/season/repository';

import { IAlert } from '../../common/alert';
import { MyNavigation } from 'src/app/common/navigation';
import { ExternalObjectRepository } from 'src/app/lib/external/repository';
import { ExternalSourceRepository } from 'src/app/lib/external/source/repository';
import { ExternalSource } from 'src/app/lib/external/source';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExternalSourceSelectModalComponent } from '../externalsource/selectmodal.component';
import { AttacherRepository } from 'src/app/lib/attacher/repository';
import { JsonAttacher } from 'src/app/lib/attacher/mapper';
import { Season } from 'ngx-sport';

@Component({
  selector: 'app-season-attach',
  templateUrl: './attach.component.html',
  styleUrls: ['./attach.component.css']
})
export class SeasonAttachComponent implements OnInit {
  public alert: IAlert;
  public processing = true;
  public externalprocessing = false;
  season: Season;
  externalSource: ExternalSource;
  externalSeasons: Season[];

  constructor(
    private seasonRepos: SeasonRepository,
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
      this.seasonRepos.getObject(+params.id)
        .subscribe(
        /* happy path */(season: Season) => {
            this.season = season;
          },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
        );

      this.externalSourceRepos.getObject(+params.externalSourceId)
        .subscribe(
        /* happy path */(externalSource: ExternalSource) => {
            this.externalSource = externalSource;
            this.updateExternalSeasons();
          },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
        );
    });
  }

  protected updateExternalSeasons() {
    this.externalprocessing = true;
    this.externalObjectRepos.getSeasons(this.externalSource)
      .subscribe(
          /* happy path */(externalSeasons: Season[]) => {
          this.externalSeasons = externalSeasons.sort((a, b) => a.getName() < b.getName() ? -1 : 0);
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
        if (this.externalSource.hasSeasonImplementation() === false) {
          this.setAlert('danger', 'deze externe bron heeft geen seizoenen');
          return;
        }
        this.processing = true;
        this.updateExternalSeasons();
      }
    }, (reason) => {
    });
  }

  attach(externalSeason: Season) {
    this.processing = true;
    const json: JsonAttacher = {
      importableId: +this.season.getId(),
      externalId: '' + externalSeason.getId()
    };
    this.attacherRepos.createSeason(json, this.externalSource)
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

