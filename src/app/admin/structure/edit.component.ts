import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Competition, CompetitionRepository, PoulePlace, Structure, StructureMapper, StructureRepository } from 'ngx-sport';
import { Subscription } from 'rxjs';

import { IAlert } from '../../app.definitions';

@Component({
  selector: 'app-competition-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class StructureEditComponent implements OnInit, OnDestroy {

  protected sub: Subscription;
  public alert: IAlert;
  public processing = true;
  customForm: FormGroup;
  competition: Competition;
  private structure: Structure;

  validations: StructureValidations = {
    minnrofcompetitors: 2,
    maxnrofcompetitors: 32,
  };

  constructor(
    private structureMapper: StructureMapper,
    private structureRepository: StructureRepository,
    private competitionRepos: CompetitionRepository,
    private route: ActivatedRoute,
    private router: Router,
    fb: FormBuilder
  ) {
    this.customForm = fb.group({
      nrofcompetitors: ['', Validators.compose([
        Validators.required,
        Validators.min(this.validations.minnrofcompetitors),
        Validators.max(this.validations.maxnrofcompetitors)
      ])],
    });
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.competitionRepos.getObject(+params.id)
        .subscribe(
        /* happy path */(competition: Competition) => {
            this.competition = competition;
            this.structureRepository.getObject(this.competition)
              .subscribe(
              /* happy path */(structure: Structure) => {
                  this.structure = structure;
                }
                ,
            /* error path */ e => { },
            /* onComplete */() => { }
              );
          },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
        );
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  create() {

    // this.structureService = new StructureService(
    //   this.competition,
    //   { min: 2, max: 64 },
    //   undefined,
    //   this.customForm.controls.nrofcompetitors.value
    // );

    this.structure.getFirstRoundNumber().getConfig().setNrOfHeadtoheadMatches(2);
    const json = this.structureMapper.toJson(this.structure);
    this.structureRepository.createObject(json, this.competition).subscribe(
              /* happy path */(structureRes) => {
        this.structure = structureRes;
      },
            /* error path */ e => { this.processing = false; },
            /* onComplete */() => { this.processing = false; }
    );
    return false;
  }

  editPoulePlace(poulePlace: PoulePlace) {
    this.linkToEdit(this.competition, poulePlace);
  }

  linkToEdit(competition: Competition, poulePlace: PoulePlace) {
    this.router.navigate(
      ['/admin/pouleplace/edit', competition.getId(), poulePlace.getId()],
      {
        queryParams: {
          returnAction: '/admin/structure',
          returnParam: competition.getId()
        }
      }
    );
  }

  isStarted() {
    return this.structure.getRootRound().isStarted();
  }

  getPoulePlaces() {
    if (this.structure === undefined) {
      return [];
    }
    return this.structure.getRootRound().getPoules()[0].getPlaces();
  }

  // edit() {
  //   this.processing = true;

  //   const startDateTime = this.convertDate(this.customForm.controls.startDateTime.value);
  //   const season = this.customForm.controls.season.value;

  //   if (this.isStartDateTimeInSeason(startDateTime, season)) {
  //     this.setAlert('danger', 'de startdatum valut buiten het seizoen');
  //     this.processing = false;
  //     return;
  //   }

  //   this.competition.setStartDateTime(startDateTime);

  //   this.competitionRepos.editObject(this.competition)
  //     .subscribe(
  //       /* happy path */ competitionRes => {
  //       this.navigateBack();
  //     },
  //       /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
  //       /* onComplete */() => { this.processing = false; }
  //     );
  // }

  navigateBack() {
    this.router.navigate(['/admin/competition/home', this.competition.getId()]);
  }

  protected setAlert(type: string, message: string) {
    this.alert = { 'type': type, 'message': message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }
}

export interface StructureValidations {
  maxnrofcompetitors: number;
  minnrofcompetitors: number;
}
