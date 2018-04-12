import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module';
import { Association, AssociationRepository, ILeague, League, LeagueRepository, SportConfig } from 'ngx-sport';
import { Subscription } from 'rxjs/Subscription';

import { IAlert } from '../../app.definitions';

@Component({
  selector: 'app-league-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class LeagueEditComponent implements OnInit, OnDestroy {

  protected sub: Subscription;
  returnUrl: string;
  returnUrlParam: number;
  returnUrlQueryParamKey: string;
  returnUrlQueryParamValue: string;
  public alert: IAlert;
  public processing = true;
  customForm: FormGroup;
  leagues: League[];
  league: League;
  sports: string[];
  associations: Association[];

  validations: LeagueValidations = {
    minlengthname: League.MIN_LENGTH_NAME,
    maxlengthname: League.MAX_LENGTH_NAME,
    maxlengthabbreviation: League.MAX_LENGTH_ABBREVIATION,
    maxlengthsport: League.MAX_LENGTH_SPORT
  };

  constructor(
    private associationRepos: AssociationRepository,
    private leagueRepos: LeagueRepository,
    private route: ActivatedRoute,
    private router: Router,
    fb: FormBuilder
  ) {
    this.sports = SportConfig.getSports();
    this.customForm = fb.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validations.minlengthname),
        Validators.maxLength(this.validations.maxlengthname)
      ])],
      abbreviation: ['', Validators.maxLength(this.validations.maxlengthabbreviation)],
      sport: ['', Validators.required],
      association: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.associationRepos.getObjects()
      .subscribe(
          /* happy path */(associations: Association[]) => {
          this.associations = associations;

        },
          /* error path */ e => { },
          /* onComplete */() => { }
      );

    this.sub = this.route.params.subscribe(params => {
      this.leagueRepos.getObjects()
        .subscribe(
        /* happy path */(leagues: League[]) => {
            this.leagues = leagues;
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private postInit(id: number) {
    if (id === undefined || id < 1) {
      return;
    }
    this.league = this.leagues.find(league => league.getId() === id);
    if (this.league === undefined) {
      return;
    }
    this.customForm.controls.name.setValue(this.league.getName());
    this.customForm.controls.abbreviation.setValue(this.league.getAbbreviation());
    this.customForm.controls.sport.setValue(this.league.getSport());
    this.customForm.controls.association.setValue(this.league.getAssociation());
    this.customForm.controls.association.disable();
  }

  save() {
    if (this.league !== undefined) {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    this.processing = true;

    const name = this.customForm.controls.name.value;
    const abbreviation = this.customForm.controls.abbreviation.value;
    const sport = this.customForm.controls.sport.value;
    const association = this.customForm.controls.association.value;

    if (this.isNameDuplicate(this.customForm.controls.name.value)) {
      this.setAlert('danger', 'de naam bestaan al');
      this.processing = false;
      return;
    }
    const league: ILeague = {
      name: name,
      abbreviation: abbreviation ? abbreviation : undefined,
      association: this.associationRepos.objectToJsonHelper(association),
      sport: sport,
    };
    this.leagueRepos.createObject(league)
      .subscribe(
        /* happy path */ leagueRes => {
          this.navigateBack();
        },
        /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => this.processing = false
      );
  }

  edit() {
    this.processing = true;

    if (this.isNameDuplicate(this.customForm.controls.name.value, this.league)) {
      this.setAlert('danger', 'de naam bestaan al');
      this.processing = false;
      return;
    }
    const name = this.customForm.controls.name.value;
    const abbreviation = this.customForm.controls.abbreviation.value;
    const sport = this.customForm.controls.sport.value;
    const association = this.customForm.controls.association.value;

    this.league.setName(name);
    this.league.setAbbreviation(abbreviation ? abbreviation : undefined);
    this.league.setSport(sport);
    this.league.setAssociation(association);

    this.leagueRepos.editObject(this.league)
      .subscribe(
        /* happy path */ leagueRes => {
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

  isNameDuplicate(name: string, league?: League): boolean {
    return this.leagues.find(leagueIt => {
      return (name === leagueIt.getName() && (league === undefined || league !== leagueIt));
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

export interface LeagueValidations {
  maxlengthname: number;
  minlengthname: number;
  maxlengthabbreviation: number;
  maxlengthsport: number;
}
