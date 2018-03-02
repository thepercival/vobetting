import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module';
import { ISeason, Season, SeasonRepository } from 'ngx-sport';
import { Subscription } from 'rxjs/Subscription';

import { IAlert } from '../../app.definitions';

@Component({
  selector: 'app-season-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class SeasonEditComponent implements OnInit, OnDestroy {

  protected sub: Subscription;
  returnUrl: string;
  returnUrlParam: number;
  returnUrlQueryParamKey: string;
  returnUrlQueryParamValue: string;
  alert: IAlert;
  processing = true;
  customForm: FormGroup;
  seasons: Season[];
  season: Season;

  validations: SeasonValidations = {
    minlengthname: Season.MIN_LENGTH_NAME,
    maxlengthname: Season.MAX_LENGTH_NAME
  };

  constructor(
    private seasonRepos: SeasonRepository,
    private route: ActivatedRoute,
    private router: Router,
    fb: FormBuilder
  ) {
    this.customForm = fb.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validations.minlengthname),
        Validators.maxLength(this.validations.maxlengthname)
      ])],
      startDateTime: ['', Validators.required],
      endDateTime: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.seasonRepos.getObjects()
        .subscribe(
        /* happy path */(seasons: Season[]) => {
          this.seasons = seasons;
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
    this.season = this.seasons.find(season => season.getId() === id);
    if (this.season === undefined) {
      return;
    }
    this.customForm.controls.name.setValue(this.season.getName());
    this.customForm.controls.startDateTime.setValue(this.convertDateBack(this.season.getStartDateTime()));
    this.customForm.controls.endDateTime.setValue(this.convertDateBack(this.season.getEndDateTime()));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  save() {
    if (this.season !== undefined) {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    this.processing = true;

    const name = this.customForm.controls.name.value;
    const startDateTime = this.convertDate(this.customForm.controls.startDateTime.value);
    const endDateTime = this.convertDate(this.customForm.controls.endDateTime.value);

    if (this.isNameDuplicate(this.customForm.controls.name.value)) {
      this.setAlert('danger', 'de naam bestaan al');
      this.processing = false;
      return;
    }
    const season: ISeason = {
      name: name,
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString()
    };
    this.seasonRepos.createObject(season)
      .subscribe(
        /* happy path */ seasonRes => {
        this.navigateBack();
      },
        /* error path */ e => { this.setAlert('danger', e); },
        /* onComplete */() => this.processing = false
      );
  }

  edit() {
    this.processing = true;

    if (this.isNameDuplicate(this.customForm.controls.name.value, this.season)) {
      this.setAlert('danger', 'de naam bestaan al');
      this.processing = false;
      return;
    }
    const name = this.customForm.controls.name.value;
    const startDateTime = this.convertDate(this.customForm.controls.startDateTime.value);
    const endDateTime = this.convertDate(this.customForm.controls.endDateTime.value);

    this.season.setName(name);
    this.season.setStartDateTime(startDateTime);
    this.season.setEndDateTime(endDateTime);

    this.seasonRepos.editObject(this.season)
      .subscribe(
        /* happy path */ seasonRes => {
        this.navigateBack();
      },
        /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => { this.processing = false; }
      );
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

  isNameDuplicate(name: string, season?: Season): boolean {
    return this.seasons.find(seasonIt => {
      return (name === seasonIt.getName() && (season === undefined || season !== seasonIt));
    }) !== undefined;
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

export interface SeasonValidations {
  maxlengthname: number;
  minlengthname: number;
}
