import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {
  Competitionseason, CompetitionseasonRepository, ICompetitionseason,
  Competition, AssociationRepository, CompetitionRepository, SeasonRepository
} from 'ngx-sport';
import { Subscription } from 'rxjs/Subscription';
import { forkJoin } from 'rxjs/observable/forkJoin';
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
  competitionseasons: Competitionseason[];
  competitionseason: Competitionseason;

  validations: CompetitionseasonValidations = {
    maxlengthsport: Competitionseason.MAX_LENGTH_SPORT
  };

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
      /*name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validations.minlengthname),
        Validators.maxLength(this.validations.maxlengthname)
      ])],*/
      sport: ['', Validators.maxLength(this.validations.maxlengthsport)]
    });
  }

  ngOnInit() {

    const reposUpdates = [
      this.associationRepos.getObjects(),
      this.competitionRepos.getObjects(),
      this.seasonRepos.getObjects()
    ];

    forkJoin(reposUpdates).subscribe(results => {
      console.log(reposUpdates);
      // this.poulePlaceToSwap = undefined;
      this.processing = false;
    },
      err => {
        // this.setAlert('danger', 'volgorde niet gewijzigd: ' + err);
        this.processing = false;
      }
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
    // this.customForm.controls.name.setValue(this.competitionseason.getName());
    this.customForm.controls.sport.setValue(this.competitionseason.getSport());
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

    // const name = this.customForm.controls.name.value;
    const sport = this.customForm.controls.sport.value;

    // if (this.isNameDuplicate(this.customForm.controls.name.value)) {
    //   this.setAlert('danger', 'de naam bestaan al');
    //   this.processing = false;
    //   return;
    // }

    const competitionseason: ICompetitionseason = {
      association: undefined, // IAssociation;
      competition: undefined, // ICompetition;
      season: undefined, // ISeason;
      fields: [],
      referees: [],
      startDateTime: undefined, // string; from Season
      sport: sport,
      state: Competitionseason.STATE_CREATED

    };
    this.competitionseasonRepos.createObject(competitionseason)
      .subscribe(
        /* happy path */ competitionseasonRes => {
        this.navigateBack();
      },
        /* error path */ e => { this.setAlert('danger', e); },
        /* onComplete */() => this.processing = false
      );
  }

  edit() {
    this.processing = true;

    // if (this.isNameDuplicate(this.customForm.controls.name.value, this.competitionseason)) {
    //   this.setAlert('danger', 'de naam bestaan al');
    //   this.processing = false;
    //   return;
    // }
    // const name = this.customForm.controls.name.value;
    const sport = this.customForm.controls.sport.value;

    // this.competitionseason.setName(name);
    this.competitionseason.setSport(sport);

    this.competitionseasonRepos.editObject(this.competitionseason)
      .subscribe(
        /* happy path */ competitionseasonRes => {
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

  // isNameDuplicate(name: string, competitionseason?: Competitionseason): boolean {
  //   return this.competitionseasons.find(competitionseasonIt => {
  //     return (name === competitionseasonIt.getName() && (competitionseason === undefined || competitionseason !== competitionseasonIt));
  //   }) !== undefined;
  // }

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

export interface CompetitionseasonValidations {
  maxlengthsport: number;
}
