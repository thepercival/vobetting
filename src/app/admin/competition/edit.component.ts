import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Competition, CompetitionRepository, ICompetition } from 'ngx-sport';
import { Subscription } from 'rxjs/Subscription';

import { IAlert } from '../../app.definitions';

@Component({
  selector: 'app-competition-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class CompetitionEditComponent implements OnInit {

  protected sub: Subscription;
  returnUrl: string;
  returnUrlParam: number;
  returnUrlQueryParamKey: string;
  returnUrlQueryParamValue: string;
  public alert: IAlert;
  public processing = true;
  customForm: FormGroup;
  competitions: Competition[];
  competition: Competition;

  validations: CompetitionValidations = {
    minlengthname: Competition.MIN_LENGTH_NAME,
    maxlengthname: Competition.MAX_LENGTH_NAME,
    maxlengthabbreviation: Competition.MAX_LENGTH_ABBREVIATION
  };

  constructor(
    private competitionRepos: CompetitionRepository,
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
      abbreviation: ['', Validators.maxLength(this.validations.maxlengthabbreviation)]
    });
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.competitionRepos.getObjects()
        .subscribe(
        /* happy path */(competitions: Competition[]) => {
          this.competitions = competitions;
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
    this.competition = this.competitions.find(competition => competition.getId() === id);
    if (this.competition === undefined) {
      return;
    }
    this.customForm.controls.name.setValue(this.competition.getName());
    this.customForm.controls.abbreviation.setValue(this.competition.getAbbreviation());
  }

  save() {
    if (this.competition !== undefined) {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    this.processing = true;

    const name = this.customForm.controls.name.value;
    const abbreviation = this.customForm.controls.abbreviation.value;

    if (this.isNameDuplicate(this.customForm.controls.name.value)) {
      this.setAlert('danger', 'de naam bestaan al');
      this.processing = false;
      return;
    }
    const competition: ICompetition = {
      name: name,
      abbreviation: abbreviation ? abbreviation : undefined
    };
    this.competitionRepos.createObject(competition)
      .subscribe(
        /* happy path */ competitionRes => {
        this.navigateBack();
      },
        /* error path */ e => { this.setAlert('danger', e); },
        /* onComplete */() => this.processing = false
      );
  }

  edit() {
    this.processing = true;

    if (this.isNameDuplicate(this.customForm.controls.name.value, this.competition)) {
      this.setAlert('danger', 'de naam bestaan al');
      this.processing = false;
      return;
    }
    const name = this.customForm.controls.name.value;
    const abbreviation = this.customForm.controls.abbreviation.value;

    this.competition.setName(name);
    this.competition.setAbbreviation(abbreviation ? abbreviation : undefined);

    this.competitionRepos.editObject(this.competition)
      .subscribe(
        /* happy path */ competitionRes => {
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

  isNameDuplicate(name: string, competition?: Competition): boolean {
    return this.competitions.find(competitionIt => {
      return (name === competitionIt.getName() && (competition === undefined || competition !== competitionIt));
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

export interface CompetitionValidations {
  maxlengthname: number;
  minlengthname: number;
  maxlengthabbreviation: number;
}
