import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompetitorRepository } from '../../lib/ngx-sport/competitor/repository';

import { IAlert } from '../../common/alert';
import { MyNavigation } from 'src/app/common/navigation';
import { ExternalObjectRepository } from 'src/app/lib/external/repository';
import { ExternalSourceRepository } from 'src/app/lib/external/source/repository';
import { ExternalSource } from 'src/app/lib/external/source';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExternalSourceSelectModalComponent } from '../externalsource/selectmodal.component';
import { AttacherRepository } from 'src/app/lib/attacher/repository';
import { JsonAttacher } from 'src/app/lib/attacher/mapper';
import { Competitor, Competition } from 'ngx-sport';
import { CompetitionRepository } from 'src/app/lib/ngx-sport/competition/repository';
import { Attacher } from 'src/app/lib/attacher';

@Component({
  selector: 'app-competitor-attach',
  templateUrl: './attach.component.html',
  styleUrls: ['./attach.component.css']
})
export class CompetitorAttachComponent implements OnInit {
  public alert: IAlert;
  public processing = true;
  public externalprocessing = false;
  competitor: Competitor;
  competition: Competition;
  externalCompetition: Competition;
  externalSource: ExternalSource;
  externalCompetitors: Competitor[];

  constructor(
    private competitorRepos: CompetitorRepository,
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
      this.competitionRepos.getObject(+params.competitionId)
        .subscribe(
        /* happy path */(competition: Competition) => {
            this.competition = competition;
            this.competitorRepos.getObject(+params.id, competition.getLeague().getAssociation())
              .subscribe(
                /* happy path */(competitor: Competitor) => {
                  this.competitor = competitor;
                },
                /* error path */ e => { },
                /* onComplete */() => { this.processing = false; }
              );
            this.externalSourceRepos.getObject(+params.externalSourceId)
              .subscribe(
                /* happy path */(externalSource: ExternalSource) => {
                  this.externalSource = externalSource;
                  this.attacherRepos.getCompetition(externalSource, this.competition)
                    .subscribe(
                        /* happy path */(competitionAttacher: Attacher) => {
                        this.externalObjectRepos.getCompetition(externalSource, competitionAttacher.getExternalId())
                          .subscribe(
                            /* happy path */(externalCompetition) => {
                              this.externalCompetition = externalCompetition;
                              this.updateExternalCompetitors(this.externalCompetition);
                            },
                            /* error path */ e => { },
                            /* onComplete */() => { this.processing = false; }
                          );
                      },
                        /* error path */ e => { },
                        /* onComplete */() => { this.processing = false; }
                    );
                },
                /* error path */ e => { },
                /* onComplete */() => { this.processing = false; }
              );
          },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
        );

    });
  }

  protected updateExternalCompetitors(externalCompetition: Competition) {
    this.externalprocessing = true;
    this.externalObjectRepos.getCompetitors(this.externalSource, externalCompetition)
      .subscribe(
          /* happy path */(externalCompetitors: Competitor[]) => {
          this.externalCompetitors = externalCompetitors.sort((a, b) => a.getName() < b.getName() ? -1 : 0);
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
        if (this.externalSource.hasCompetitorImplementation() === false) {
          this.setAlert('danger', 'deze externe bron heeft geen competities');
          return;
        }
        this.processing = true;
        this.updateExternalCompetitors(this.externalCompetition);
      }
    }, (reason) => {
    });
  }

  attach(externalCompetitor: Competitor) {
    this.processing = true;
    const json: JsonAttacher = {
      importableId: +this.competitor.getId(),
      externalId: '' + externalCompetitor.getId()
    };
    this.attacherRepos.createCompetitor(json, this.externalSource)
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

