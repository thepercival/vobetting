import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Competition, JsonCompetition, League, Season, RankingService, State, Sport, Structure, NameService, Competitor, Place
} from 'ngx-sport';
import { CompetitionRepository } from '../../lib/ngx-sport/competition/repository';


import { IAlert } from '../../common/alert';
import { MyNavigation } from 'src/app/common/navigation';
import { ExternalSourceSelectModalComponent } from '../externalsource/selectmodal.component';
import { ExternalSource } from 'src/app/lib/external/source';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StructureRepository } from 'src/app/lib/ngx-sport/structure/repository';
import { ExternalSourceRepository } from 'src/app/lib/external/source/repository';
import { Attacher } from 'src/app/lib/attacher';
import { AttacherRepository } from 'src/app/lib/attacher/repository';
import { ExternalObjectRepository } from 'src/app/lib/external/repository';

@Component({
  selector: 'app-competition-structure',
  templateUrl: './structure.component.html',
  styleUrls: ['./structure.component.css']
})
export class CompetitionStructureComponent implements OnInit {
  public alert: IAlert;
  public processing = true;
  public processingtaching = false;
  competition: Competition;
  structure: Structure;
  externalSource: ExternalSource;
  uiAttachers: CompetitorAttacher[];

  constructor(
    private competitionRepos: CompetitionRepository,
    private structureRepos: StructureRepository,
    private externalObjectRepos: ExternalObjectRepository,
    private externalSourceRepos: ExternalSourceRepository,
    private attacherRepos: AttacherRepository,
    private router: Router,
    private route: ActivatedRoute,
    protected myNavigation: MyNavigation,
    private modalService: NgbModal,
    public nameService: NameService
  ) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.competitionRepos.getObject(params.id)
        .subscribe(
      /* happy path */(competition: Competition) => {
            this.postInit(competition);
          },
      /* error path */ e => { this.processing = false; this.setAlert('danger', e); },
      /* onComplete */() => { this.processing = false; }
        );
    });
  }

  private postInit(competition: Competition) {
    this.competition = competition;
    this.structureRepos.getObject(competition)
      .subscribe(
        /* happy path */(structure: Structure) => {
          this.structure = structure;
          const externalSourceId = localStorage.getItem('externalSourceId');
          if (this.structure && externalSourceId) {
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
        /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
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

    if (this.externalSource.hasCompetitorImplementation() === false) {
      this.setAlert('danger', 'deze externe bron heeft geen deelnemers');
      return;
    }
    this.processing = true;
    this.getAttachers(this.externalSource);
  }

  getAttacher(place: Place): CompetitorAttacher {
    if (this.uiAttachers === undefined) {
      return undefined;
    }
    return this.uiAttachers.find(uiAttacher => uiAttacher.place === place);
  }

  protected getAttachers(externalSource: ExternalSource) {
    this.uiAttachers = [];
    this.attacherRepos.getCompetition(externalSource, this.competition)
      .subscribe(
        /* happy path */(competitionAttacher: Attacher) => {
          this.externalObjectRepos.getCompetition(externalSource, competitionAttacher.getExternalId())
            .subscribe(
              /* happy path */(externalCompetition) => {
                this.attacherRepos.getCompetitors(externalSource, externalCompetition.getId())
                  .subscribe(
                    /* happy path */(attachers) => {
                      this.externalObjectRepos.getCompetitors(externalSource, externalCompetition)
                        .subscribe(
                      /* happy path */(externalCompetitors: Competitor[]) => {
                            this.structure.getFirstRoundNumber().getPoules().forEach(poule => {
                              poule.getPlaces().forEach(place => {
                                let attacher;
                                let externalCompetitor;
                                if (place.getCompetitor()) {
                                  attacher = this.externalSource.getCompetitorAttacher(place.getCompetitor());
                                  externalCompetitor = attacher ? externalCompetitors.find(externalCompetitorIt => {
                                    // tslint:disable-next-line:triple-equals
                                    return externalCompetitorIt.getId() == attacher.getExternalId();
                                  }) : undefined;
                                }
                                const uiAttacher: CompetitorAttacher = { place, attacher, externalCompetitor };
                                this.uiAttachers.push(uiAttacher);
                              });
                            });
                          },
                      /* error path */ e => { },
                      /* onComplete */() => { this.processing = false; }
                        );
                    },
              /* error path */ e => { this.processing = false; this.setAlert('danger', e); },
              /* onComplete */() => { }
                  );
              },
              /* error path */ e => { this.processing = false; this.setAlert('danger', e); },
              /* onComplete */() => { }
            );
        },
        /* error path */ e => { this.processing = false; this.setAlert('danger', e); },
        /* onComplete */() => { }
      );
  }



  navigateBack() {
    this.myNavigation.back();
  }

  attach(uiAttacher: CompetitorAttacher) {
    this.router.navigate(['/admin/competitor/attach',
      uiAttacher.place.getCompetitor().getId(), this.competition.getId(), this.externalSource.getId()]);
  }

  detach(competitorAttacher: CompetitorAttacher) {
    this.processingtaching = true;
    this.attacherRepos.removeCompetitor(competitorAttacher.attacher)
      .subscribe(
        /* happy path */() => {
          competitorAttacher.externalCompetitor = undefined;
          competitorAttacher.attacher = undefined;
        },
        /* error path */ e => { this.processingtaching = false; this.setAlert('danger', e); },
        /* onComplete */() => { this.processingtaching = false; }
      );
  }

  protected setAlert(type: string, message: string) {
    this.alert = { type, message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }
}

interface CompetitorAttacher {
  place: Place;
  attacher: Attacher;
  externalCompetitor: Competitor;
}
