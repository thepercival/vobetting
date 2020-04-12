import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompetitionRepository } from '../../lib/ngx-sport/competition/repository';

import { IAlert } from '../../common/alert';
import { MyNavigation } from 'src/app/common/navigation';
import { ExternalObjectRepository } from 'src/app/lib/external/repository';
import { ExternalSourceRepository } from 'src/app/lib/external/source/repository';
import { ExternalSource } from 'src/app/lib/external/source';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExternalSourceSelectModalComponent } from '../externalsource/selectmodal.component';
import { AttacherRepository } from 'src/app/lib/attacher/repository';
import { JsonAttacher } from 'src/app/lib/attacher/mapper';
import { Competition } from 'ngx-sport';

@Component({
  selector: 'app-competition-attach',
  templateUrl: './attach.component.html',
  styleUrls: ['./attach.component.css']
})
export class CompetitionAttachComponent implements OnInit {
  public alert: IAlert;
  public processing = true;
  public externalprocessing = false;
  competition: Competition;
  externalSource: ExternalSource;
  externalCompetitions: Competition[];

  constructor(
    private competitionRepos: CompetitionRepository,
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
      this.competitionRepos.getObject(+params.id)
        .subscribe(
        /* happy path */(competition: Competition) => {
            this.competition = competition;
          },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
        );

      this.externalSourceRepos.getObject(+params.externalSourceId)
        .subscribe(
        /* happy path */(externalSource: ExternalSource) => {
            this.externalSource = externalSource;
            this.updateExternalCompetitions();
          },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
        );
    });
  }

  protected updateExternalCompetitions() {
    this.externalprocessing = true;
    this.externalObjectRepos.getCompetitions(this.externalSource)
      .subscribe(
          /* happy path */(externalCompetitions: Competition[]) => {
          this.externalCompetitions = externalCompetitions.sort((a, b) => a.getName() < b.getName() ? -1 : 0);
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
        if (this.externalSource.hasCompetitionImplementation() === false) {
          this.setAlert('danger', 'deze externe bron heeft geen competities');
          return;
        }
        this.processing = true;
        this.updateExternalCompetitions();
      }
    }, (reason) => {
    });
  }

  attach(externalCompetition: Competition) {
    this.processing = true;
    const json: JsonAttacher = {
      importableId: +this.competition.getId(),
      externalId: '' + externalCompetition.getId()
    };
    this.attacherRepos.createCompetition(json, this.externalSource)
      .subscribe(
        /* happy path */() => {
          this.navigateBack();
        },
        /* error path */ e => { this.processing = false; this.setAlert('danger', e.message); },
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

