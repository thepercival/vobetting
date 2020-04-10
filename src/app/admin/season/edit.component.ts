import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module';
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
  customForm: FormGroup;
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
    this.customForm = fb.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validations.minlengthname),
        Validators.maxLength(this.validations.maxlengthname)
      ])],
      start: ['', Validators.compose([
        Validators.required
      ])],
      end: ['', Validators.compose([
        Validators.required
      ])],
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
        /* error path */ e => { this.processing = false; this.setAlert('danger', e.message); },
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

    this.customForm.controls.name.setValue(this.season.getName());
    this.customForm.controls.start.setValue(this.season.getStartDateTime());
    this.customForm.controls.end.setValue(this.season.getEndDateTime());
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

    const name = this.customForm.controls.name.value;
    const startDateTime = this.customForm.controls.start.value;
    const endDateTime = this.customForm.controls.end.value;

    if (this.isNameDuplicate(this.customForm.controls.name.value)) {
      this.setAlert('danger', 'de naam bestaan al');
      this.processing = false;
      return;
    }
    const season: JsonSeason = {
      name, startDateTime, endDateTime
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

    if (this.isNameDuplicate(this.customForm.controls.name.value)) {
      this.setAlert('danger', 'de naam bestaan al');
      this.processing = false;
      return;
    }
    const name = this.customForm.controls.name.value;
    const startDateTime = this.customForm.controls.start.value;
    const endDateTime = this.customForm.controls.end.value;

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
