import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module';
import { Sport, SportMapper, JsonSport } from 'ngx-sport';
import { SportRepository } from '../../lib/ngx-sport/sport/repository';
import { Subscription } from 'rxjs';

import { IAlert } from '../../common/alert';
import { MyNavigation } from 'src/app/common/navigation';

@Component({
  selector: 'app-sport-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class SportEditComponent implements OnInit {
  public alert: IAlert;
  public processing = true;
  form: FormGroup;
  sports: Sport[];
  sport: Sport;
  validations: SportValidations = {
    minlengthname: Sport.MIN_LENGTH_NAME,
    maxlengthname: Sport.MAX_LENGTH_NAME,
    minlengthcustomid: 0,
    maxlengthcustomid: Sport.MAX_LENGTH_NAME
  };

  constructor(
    private sportRepos: SportRepository,
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
      team: true,
      customId: ['', Validators.compose([
        Validators.minLength(this.validations.minlengthcustomid),
        Validators.maxLength(this.validations.maxlengthcustomid)
      ])],
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sportRepos.getObjects()
        .subscribe(
        /* happy path */(sports: Sport[]) => {
            this.sports = sports;
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
    this.sport = this.sports.find(sport => sport.getId() === id);
    if (this.sport === undefined) {
      return;
    }
    // remove sport from all sports
    const index = this.sports.indexOf(this.sport);
    if (index > -1) {
      this.sports.splice(index, 1);
    }

    this.form.controls.name.setValue(this.sport.getName());
    this.form.controls.team.setValue(this.sport.getTeam());
    this.form.controls.customId.setValue(this.sport.getCustomId());
  }

  save() {
    if (this.sport !== undefined) {
      this.edit();
    } else {
      this.add();
    }
    return false;
  }

  add() {
    this.processing = true;

    const name = this.form.controls.name.value;
    const team = this.form.controls.team.value;
    const customId = this.form.controls.customId.value;

    if (this.isNameDuplicate(this.form.controls.name.value)) {
      this.setAlert('danger', 'de naam bestaan al');
      this.processing = false;
      return;
    }
    const sport: JsonSport = { name, team, customId };
    this.sportRepos.createObject(sport)
      .subscribe(
        /* happy path */ sportRes => {
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
    const team = this.form.controls.team.value;
    const customId = this.form.controls.customId.value;

    this.sport.setName(name);
    this.sport.setTeam(team);
    this.sport.setCustomId(customId ? customId : undefined);

    this.sportRepos.editObject(this.sport)
      .subscribe(
        /* happy path */ sportRes => {
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
    return this.sports.find(sportIt => name === sportIt.getName()) !== undefined;
  }

  protected setAlert(type: string, message: string) {
    this.alert = { type, message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }
}

export interface SportValidations {
  maxlengthname: number;
  minlengthname: number;
  maxlengthcustomid: number;
  minlengthcustomid: number;
}
