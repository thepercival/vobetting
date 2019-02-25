import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AssociationRepository,
  Competition,
  CompetitionRepository,
  Competitor,
  CompetitorRepository,
  PoulePlace,
  PoulePlaceRepository,
  Structure,
  StructureRepository,
} from 'ngx-sport';
import { Subscription } from 'rxjs';

import { IAlert } from '../../app.definitions';

@Component({
  selector: 'app-pouleplace-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class PoulePlaceEditComponent implements OnInit, OnDestroy {

  protected sub: Subscription;
  returnUrl: string;
  returnUrlParam: number;
  returnUrlQueryParamKey: string;
  returnUrlQueryParamValue: string;
  public alert: IAlert;
  public processing = true;
  customForm: FormGroup;
  competitors: Competitor[];
  competitor: Competitor;
  poulePlace: PoulePlace;
  competition: Competition;
  structure: Structure;

  constructor(
    private competitorRepos: CompetitorRepository,
    private competitionRepos: CompetitionRepository,
    private associationRepos: AssociationRepository,
    private pouleplaceRepos: PoulePlaceRepository,
    private structureRepository: StructureRepository,
    private route: ActivatedRoute,
    private router: Router,
    fb: FormBuilder
  ) {
    this.customForm = fb.group({
      competitor: ['']
    });
  }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.competitionRepos.getObject(+params.competitionid)
        .subscribe(
        /* happy path */(competition: Competition) => {
            this.competition = competition;

            this.competitorRepos.getObjects(this.competition.getLeague().getAssociation())
              .subscribe(
            /* happy path */(competitors: Competitor[]) => {
                  this.competitors = competitors;

                },
            /* error path */ e => { },
            /* onComplete */() => { this.processing = false; }
              );

            this.structureRepository.getObject(this.competition)
              .subscribe(
              /* happy path */(structureRes) => {
                  this.structure = structureRes;
                  this.postInit(+params.id);

                },
            /* error path */ e => { },
            /* onComplete */() => { }
              );
          },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
        );
    });

    this.route.queryParamMap.subscribe(params => {
      this.returnUrl = params.get('returnAction');
      if (params.get('returnParam') !== null) {
        this.returnUrlParam = +params.get('returnParam');
      }
      this.returnUrlQueryParamKey = params.get('returnQueryParamKey');
      this.returnUrlQueryParamValue = params.get('returnQueryParamValue');
    });
  }

  getPoulePlaces() {
    return this.structure.getRootRound().getPoules()[0].getPlaces();
  }

  private postInit(id: number) {
    if (id === undefined || id < 1) {
      return;
    }
    this.poulePlace = this.getPoulePlaces().find(pouleplace => pouleplace.getId() === id);
    if (this.poulePlace !== undefined) {
      this.customForm.controls.competitor.setValue(this.poulePlace.getCompetitor());
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  save() {
    this.processing = true;

    const competitor = this.customForm.controls.competitor.value;

    // if (this.isCompetitorDuplicate(competitor)) {
    //   this.setAlert('danger', 'de naam bestaan al');
    //   this.processing = false;
    //   return;
    // }


    this.poulePlace.setCompetitor(competitor);

    this.pouleplaceRepos.editObject(this.poulePlace, this.poulePlace.getPoule())
      .subscribe(
        /* happy path */ poulePlaceRes => {
          this.navigateBack();
        },
        /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => { this.processing = false; }
      );
    return false;
  }

  private getForwarUrl() {
    if (this.returnUrlParam !== undefined) {
      return [this.returnUrl, this.returnUrlParam];
    }
    return [this.returnUrl];
  }

  private getForwarUrlQueryParams(): {} {
    const queryParams = {};
    queryParams[this.returnUrlQueryParamKey] = this.returnUrlQueryParamValue;
    return queryParams;
  }

  navigateBack() {
    this.router.navigate(this.getForwarUrl(), { queryParams: this.getForwarUrlQueryParams() });
  }

  // isCompetitorDuplicate(competitor: Competitor): boolean {
  //   return this.competitors.find(competitorIt => {
  //     return (name === competitorIt.getName() && (competitor === undefined || competitor !== competitorIt));
  //   }) !== undefined;
  // }

  protected setAlert(type: string, message: string) {
    this.alert = { 'type': type, 'message': message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }
}
