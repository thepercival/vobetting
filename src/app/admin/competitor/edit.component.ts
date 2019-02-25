import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module';
import { Association, AssociationRepository, Competitor, CompetitorRepository, JsonCompetitor } from 'ngx-sport';
import { Subscription } from 'rxjs';

import { IAlert } from '../../app.definitions';

@Component({
  selector: 'app-competitor-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class CompetitorEditComponent implements OnInit, OnDestroy {

  protected sub: Subscription;
  returnUrl: string;
  returnUrlParam: number;
  returnUrlQueryParamKey: string;
  returnUrlQueryParamValue: string;
  public alert: IAlert;
  public processing = true;
  customForm: FormGroup;
  competitors: Competitor[] = [];
  competitor: Competitor;
  associations: Association[] = [];
  association: Association;

  validations: CompetitorValidations = {
    minlengthname: Competitor.MIN_LENGTH_NAME,
    maxlengthname: Competitor.MAX_LENGTH_NAME,
    maxlengthabbreviation: Competitor.MAX_LENGTH_ABBREVIATION
  };

  constructor(
    private competitorRepos: CompetitorRepository,
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
            this.competitorRepos.getObjects(association)
              .subscribe(
                    /* happy path */(competitors: Competitor[]) => {
                  this.competitors = competitors;
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
    this.competitor = this.competitors.find(competitor => competitor.getId() === id);
    if (this.competitor === undefined) {
      return;
    }
    this.customForm.controls.name.setValue(this.competitor.getName());
    this.customForm.controls.abbreviation.setValue(this.competitor.getAbbreviation());
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  save() {
    if (this.competitor !== undefined) {
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
    const competitor: JsonCompetitor = {
      name: name,
      abbreviation: abbreviation ? abbreviation : undefined
    };
    this.competitorRepos.createObject(competitor, association)
      .subscribe(
        /* happy path */ competitorRes => {
          this.navigateBack();
        },
        /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => this.processing = false
      );
  }

  edit() {
    this.processing = true;

    if (this.isNameDuplicate(this.customForm.controls.name.value, this.competitor)) {
      this.setAlert('danger', 'de naam bestaan al');
      this.processing = false;
      return;
    }
    const name = this.customForm.controls.name.value;
    const abbreviation = this.customForm.controls.abbreviation.value;

    this.competitor.setName(name);
    this.competitor.setAbbreviation(abbreviation ? abbreviation : undefined);

    this.competitorRepos.editObject(this.competitor)
      .subscribe(
        /* happy path */ competitorRes => {
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

  isNameDuplicate(name: string, competitor?: Competitor): boolean {
    return this.competitors.find(competitorIt => {
      return (name === competitorIt.getName() && (competitor === undefined || competitor !== competitorIt));
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

export interface CompetitorValidations {
  maxlengthname: number;
  minlengthname: number;
  maxlengthabbreviation: number;
}
