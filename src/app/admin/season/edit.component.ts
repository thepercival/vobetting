import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Season, SeasonMapper, JsonSeason } from 'ngx-sport';
import { SeasonRepository } from '../../lib/ngx-sport/season/repository';
import { Subscription } from 'rxjs';

import { IAlert } from '../../common/alert';
import { MyNavigation } from 'src/app/common/navigation';

@Component({
  selector: 'app-season-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class SeasonEditComponent implements OnInit {
  public alert: IAlert;
  public processing = true;
  form: FormGroup;
  seasons: Season[];
  season: Season;
  validations: SeasonValidations = {
    minlengthname: Season.MIN_LENGTH_NAME,
    maxlengthname: Season.MAX_LENGTH_NAME
  };

  constructor(
    private seasonRepos: SeasonRepository,
    private seasonMapper: SeasonMapper,
    private route: ActivatedRoute,
    protected myNavigation: MyNavigation,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validations.minlengthname),
        Validators.maxLength(this.validations.maxlengthname)
      ])],
      start: ['', Validators.compose([])],
      end: ['', Validators.compose([])],
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.seasonRepos.getObjects()
        .subscribe(
        /* happy path */(seasons: Season[]) => {
            this.seasons = seasons;
            this.postInit(+params.id);
          },
        /* error path */ e => { this.processing = false; this.setAlert('danger', e); },
        /* onComplete */() => { this.processing = false; }
        );
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
    // remove season from all seasons
    const index = this.seasons.indexOf(this.season);
    if (index > -1) {
      this.seasons.splice(index, 1);
    }

    this.form.controls.name.setValue(this.season.getName());
    this.setDate(this.form.controls.start, this.season.getStartDateTime());
    this.setDate(this.form.controls.end, this.season.getEndDateTime());
  }

  getDate(dateFormControl: AbstractControl): Date {
    return new Date(dateFormControl.value.year, dateFormControl.value.month - 1, dateFormControl.value.day, 0, 0);
  }

  setDate(dateFormControl: AbstractControl, date: Date) {
    dateFormControl.setValue({ year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() });
  }

  save() {
    if (this.season !== undefined) {
      this.edit();
    } else {
      this.add();
    }
    return false;
  }

  add() {
    this.processing = true;

    const name = this.form.controls.name.value;
    const startDateTime = this.getDate(this.form.controls.start);
    const endDateTime = this.getDate(this.form.controls.end);

    if (this.isNameDuplicate(this.form.controls.name.value)) {
      this.setAlert('danger', 'de naam bestaan al');
      this.processing = false;
      return;
    }
    const season: JsonSeason = {
      name, startDateTime: startDateTime.toISOString(), endDateTime: endDateTime.toISOString()
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

    if (this.isNameDuplicate(this.form.controls.name.value)) {
      this.setAlert('danger', 'de naam bestaan al');
      this.processing = false;
      return;
    }
    const name = this.form.controls.name.value;
    const startDateTime = this.getDate(this.form.controls.start);
    const endDateTime = this.getDate(this.form.controls.end);

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

  navigateBack() {
    this.myNavigation.back();
  }

  isNameDuplicate(name: string): boolean {
    return this.seasons.find(seasonIt => name === seasonIt.getName()) !== undefined;
  }

  getFilteredSeason() {
    if (this.season === undefined) {
      return this.seasons;
    }
    // const ancestors = this.season.getAncestors();
    // return this.seasons.filter(season => {
    //   return ancestors.find(ancestor => ancestor === season) !== undefined;
    // });
  }

  protected setAlert(type: string, message: string) {
    this.alert = { type, message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }
}

export interface SeasonValidations {
  maxlengthname: number;
  minlengthname: number;
}
