import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module';
import {
  Competition,
  CompetitionRepository,
  JsonCompetition,
  League,
  LeagueMapper,
  LeagueRepository,
  Season,
  SeasonMapper,
  SeasonRepository,
} from 'ngx-sport';
import { Subscription } from 'rxjs';

import { IAlert } from '../../app.definitions';

@Component({
  selector: 'app-competition-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class CompetitionEditComponent implements OnInit, OnDestroy {

  protected sub: Subscription;
  returnUrl: string;
  returnUrlParam: number;
  returnUrlQueryParamKey: string;
  returnUrlQueryParamValue: string;
  public alert: IAlert;
  public processing = true;
  customForm: FormGroup;
  leagues: League[];
  seasons: Season[];
  competitions: Competition[];
  competition: Competition;

  constructor(
    private leagueRepos: LeagueRepository,
    private leagueMapper: LeagueMapper,
    private seasonRepos: SeasonRepository,
    private seasonMapper: SeasonMapper,
    private competitionRepos: CompetitionRepository,
    private route: ActivatedRoute,
    private router: Router,
    fb: FormBuilder
  ) {
    this.customForm = fb.group({
      league: ['', Validators.compose([
        Validators.required
      ])],
      season: ['', Validators.compose([
        Validators.required
      ])],
      startDateTime: ['', Validators.required],
    });
  }

  ngOnInit() {

    this.leagueRepos.getObjects()
      .subscribe(
        /* happy path */(leagues: League[]) => {
          this.leagues = leagues;
          this.seasonRepos.getObjects()
            .subscribe(
        /* happy path */(seasons: Season[]) => {
                this.seasons = seasons;
                this.processing = false;
              },
        /* error path */ e => { },
        /* onComplete */() => { }
            );
        },
        /* error path */ e => { },
        /* onComplete */() => { }
      );



    // forkJoin(reposUpdates).subscribe(results => {
    //   this.leagues = results[0];
    //   this.seasons = results[1];
    // },
    //   err => {
    //     // this.setAlert('danger', 'volgorde niet gewijzigd: ' + err);
    //     this.processing = false;
    //   },
    //   () => this.processing = false
    // );

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

    this.customForm.controls.league.setValue(this.competition.getLeague());
    this.customForm.controls.season.setValue(this.competition.getSeason());
    this.customForm.controls.startDateTime.setValue(this.convertDateBack(this.competition.getStartDateTime()));

    this.customForm.controls.league.disable();
    this.customForm.controls.season.disable();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  save() {
    if (this.competition !== undefined) {
      this.edit();
    } else {
      this.add();
    }
    return false;
  }

  add() {
    this.processing = true;

    const league = this.customForm.controls.league.value;
    const season = this.customForm.controls.season.value;
    const startDateTime = this.convertDate(this.customForm.controls.startDateTime.value);

    if (this.isStartDateTimeInSeason(startDateTime, season)) {
      this.setAlert('danger', 'de startdatum valut buiten het seizoen');
      this.processing = false;
      return;
    }

    const competition: JsonCompetition = {
      league: this.leagueMapper.toJson(league),
      season: this.seasonMapper.toJson(season),
      fields: [],
      referees: [],
      startDateTime: startDateTime.toISOString(),
      state: Competition.STATE_CREATED

    };
    this.competitionRepos.createObject(competition)
      .subscribe(
        /* happy path */ competitionRes => {
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

    this.competition.setStartDateTime(startDateTime);

    this.competitionRepos.editObject(this.competition)
      .subscribe(
        /* happy path */ competitionRes => {
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

  // isNameDuplicate(name: string, competition?: Competition): boolean {
  //   return this.competitions.find(competitionIt => {
  //     return (name === competitionIt.getName() && (competition === undefined || competition !== competitionIt));
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
