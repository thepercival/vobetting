import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {
  Association,
  AssociationRepository,
  Competition,
  CompetitionRepository,
  Competitionseason,
  CompetitionseasonRepository,
  ICompetitionseason,
  Season,
  SeasonRepository,
} from 'ngx-sport';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Subscription } from 'rxjs/Subscription';

import { IAlert } from '../../app.definitions';

@Component({
  selector: 'app-competitionseason-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class CompetitionseasonEditComponent implements OnInit {

  protected sub: Subscription;
  returnUrl: string;
  returnUrlParam: number;
  returnUrlQueryParamKey: string;
  returnUrlQueryParamValue: string;
  public alert: IAlert;
  public processing = true;
  customForm: FormGroup;
  associations: Association[];
  competitions: Competition[];
  seasons: Season[];
  competitionseasons: Competitionseason[];
  competitionseason: Competitionseason;

  constructor(
    private associationRepos: AssociationRepository,
    private competitionRepos: CompetitionRepository,
    private seasonRepos: SeasonRepository,
    private competitionseasonRepos: CompetitionseasonRepository,
    private route: ActivatedRoute,
    private router: Router,
    fb: FormBuilder
  ) {
    this.customForm = fb.group({
      association: ['', Validators.compose([
        Validators.required
      ])],
      competition: ['', Validators.compose([
        Validators.required
      ])],
      season: ['', Validators.compose([
        Validators.required
      ])],
      startDateTime: ['', Validators.required],
    });
  }

  ngOnInit() {

    const reposUpdates = [
      this.associationRepos.getObjects(),
      this.competitionRepos.getObjects(),
      this.seasonRepos.getObjects()
    ];

    forkJoin(reposUpdates).subscribe(results => {
      this.associations = results[0];
      this.competitions = results[1];
      this.seasons = results[2];
    },
      err => {
        // this.setAlert('danger', 'volgorde niet gewijzigd: ' + err);
        this.processing = false;
      },
      () => this.processing = false
    );

    this.sub = this.route.params.subscribe(params => {
      this.competitionseasonRepos.getObjects()
        .subscribe(
        /* happy path */(competitionseasons: Competitionseason[]) => {
          this.competitionseasons = competitionseasons;
          this.postInit(+params.id);
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

  private postInit(id: number) {
    if (id === undefined || id < 1) {
      return;
    }
    this.competitionseason = this.competitionseasons.find(competitionseason => competitionseason.getId() === id);
    if (this.competitionseason === undefined) {
      return;
    }
    this.customForm.controls.association.setValue(this.competitionseason.getAssociation());
    this.customForm.controls.competition.setValue(this.competitionseason.getCompetition());
    this.customForm.controls.season.setValue(this.competitionseason.getSeason());
    this.customForm.controls.startDateTime.setValue(this.convertDateBack(this.competitionseason.getStartDateTime()));

    this.customForm.controls.association.disable();
    this.customForm.controls.competition.disable();
    this.customForm.controls.season.disable();
  }

  save() {
    if (this.competitionseason !== undefined) {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    this.processing = true;

    const association = this.customForm.controls.association.value;
    const competition = this.customForm.controls.competition.value;
    const season = this.customForm.controls.season.value;
    const startDateTime = this.convertDate(this.customForm.controls.startDateTime.value);

    if (this.isStartDateTimeInSeason(startDateTime, season)) {
      this.setAlert('danger', 'de startdatum valut buiten het seizoen');
      this.processing = false;
      return;
    }

    const competitionseason: ICompetitionseason = {
      association: this.associationRepos.objectToJsonHelper(association),
      competition: this.competitionRepos.objectToJsonHelper(competition),
      season: this.seasonRepos.objectToJsonHelper(season),
      fields: [],
      referees: [],
      startDateTime: startDateTime.toISOString(),
      state: Competitionseason.STATE_CREATED

    };
    this.competitionseasonRepos.createObject(competitionseason)
      .subscribe(
        /* happy path */ competitionseasonRes => {
        this.navigateBack();
      },
        /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => this.processing = false
      );
  }

  edit() {
    this.processing = true;

    const startDateTime = this.convertDate(this.customForm.controls.startDateTime.value);
    const season = this.customForm.controls.season.value;

    if (this.isStartDateTimeInSeason(startDateTime, season)) {
      this.setAlert('danger', 'de startdatum valut buiten het seizoen');
      this.processing = false;
      return;
    }

    this.competitionseason.setStartDateTime(startDateTime);

    this.competitionseasonRepos.editObject(this.competitionseason)
      .subscribe(
        /* happy path */ competitionseasonRes => {
        this.navigateBack();
      },
        /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => { this.processing = false; }
      );
  }

  isStartDateTimeInSeason(startDateTime: Date, season: Season) {
    return (startDateTime < season.getStartDateTime() || startDateTime > season.getEndDateTime());
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

  // isNameDuplicate(name: string, competitionseason?: Competitionseason): boolean {
  //   return this.competitionseasons.find(competitionseasonIt => {
  //     return (name === competitionseasonIt.getName() && (competitionseason === undefined || competitionseason !== competitionseasonIt));
  //   }) !== undefined;
  // }

  updateStartDateTime(season: Season) {
    if (this.customForm.controls.startDateTime.value.length === 0) {
      this.customForm.controls.startDateTime.setValue(this.convertDateBack(season.getStartDateTime()));
    }
  }

  protected setAlert(type: string, message: string) {
    this.alert = { 'type': type, 'message': message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }

  convertDate(dateStruct: NgbDateStruct) {
    return new Date(dateStruct.year, dateStruct.month - 1, dateStruct.day, 0, 0);
  }

  convertDateBack(date: Date) {
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }
}
