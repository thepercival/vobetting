import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module';
import { Association, AssociationRepository, JsonTeam, Team, TeamRepository } from 'ngx-sport';
import { Subscription } from 'rxjs/Subscription';

import { IAlert } from '../../app.definitions';

@Component({
  selector: 'app-team-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class TeamEditComponent implements OnInit, OnDestroy {

  protected sub: Subscription;
  returnUrl: string;
  returnUrlParam: number;
  returnUrlQueryParamKey: string;
  returnUrlQueryParamValue: string;
  public alert: IAlert;
  public processing = true;
  customForm: FormGroup;
  teams: Team[] = [];
  team: Team;
  associations: Association[] = [];
  association: Association;

  validations: TeamValidations = {
    minlengthname: Team.MIN_LENGTH_NAME,
    maxlengthname: Team.MAX_LENGTH_NAME,
    maxlengthabbreviation: Team.MAX_LENGTH_ABBREVIATION
  };

  constructor(
    private teamRepos: TeamRepository,
    private associationRepos: AssociationRepository,
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
      abbreviation: ['', Validators.maxLength(this.validations.maxlengthabbreviation)],
      association: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.associationRepos.getObject(+params.associationid)
        .subscribe(
          /* happy path */(association: Association) => {
          this.associations.push(association);
          this.association = association;
          this.teamRepos.getObjects(association)
            .subscribe(
                    /* happy path */(teams: Team[]) => {
              this.teams = teams;
              this.postInit(+params.id);
            },
                  /* error path */ e => { },
                  /* onComplete */() => { }
            );
        },
          /* error path */ e => { },
          /* onComplete */() => { this.processing = false; this.postInit(+params.id); }
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
    this.customForm.controls.association.setValue(this.association);
    this.customForm.controls.association.disable();
    if (id === undefined || id < 1) {
      return;
    }
    this.team = this.teams.find(team => team.getId() === id);
    if (this.team === undefined) {
      return;
    }
    this.customForm.controls.name.setValue(this.team.getName());
    this.customForm.controls.abbreviation.setValue(this.team.getAbbreviation());
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  save() {
    if (this.team !== undefined) {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    this.processing = true;

    const name = this.customForm.controls.name.value;
    const abbreviation = this.customForm.controls.abbreviation.value;
    const association = this.customForm.controls.association.value;

    if (this.isNameDuplicate(this.customForm.controls.name.value)) {
      this.setAlert('danger', 'de naam bestaan al');
      this.processing = false;
      return;
    }
    const team: JsonTeam = {
      name: name,
      abbreviation: abbreviation ? abbreviation : undefined
    };
    this.teamRepos.createObject(team, association)
      .subscribe(
        /* happy path */ teamRes => {
        this.navigateBack();
      },
        /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => this.processing = false
      );
  }

  edit() {
    this.processing = true;

    if (this.isNameDuplicate(this.customForm.controls.name.value, this.team)) {
      this.setAlert('danger', 'de naam bestaan al');
      this.processing = false;
      return;
    }
    const name = this.customForm.controls.name.value;
    const abbreviation = this.customForm.controls.abbreviation.value;

    this.team.setName(name);
    this.team.setAbbreviation(abbreviation ? abbreviation : undefined);

    this.teamRepos.editObject(this.team)
      .subscribe(
        /* happy path */ teamRes => {
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

  isNameDuplicate(name: string, team?: Team): boolean {
    return this.teams.find(teamIt => {
      return (name === teamIt.getName() && (team === undefined || team !== teamIt));
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

export interface TeamValidations {
  maxlengthname: number;
  minlengthname: number;
  maxlengthabbreviation: number;
}
