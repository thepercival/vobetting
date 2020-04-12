import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Competition, JsonCompetition, AssociationMapper, Association, League, Season, RankingService, State, JsonSportConfig, SportConfigService, LeagueMapper, SeasonMapper } from 'ngx-sport';
import { CompetitionRepository } from '../../lib/ngx-sport/competition/repository';


import { IAlert } from '../../common/alert';
import { MyNavigation } from 'src/app/common/navigation';
import { AssociationRepository } from 'src/app/lib/ngx-sport/association/repository';
import { LeagueRepository } from 'src/app/lib/ngx-sport/league/repository';
import { SeasonRepository } from 'src/app/lib/ngx-sport/season/repository';

@Component({
  selector: 'app-competition-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class CompetitionEditComponent implements OnInit {
  public alert: IAlert;
  public processing = true;
  form: FormGroup;
  competition: Competition;
  leagues: League[];
  seasons: Season[];

  constructor(
    private competitionRepos: CompetitionRepository,
    private leagueRepos: LeagueRepository,
    private seasonRepos: SeasonRepository,
    private sportConfigService: SportConfigService,
    private leagueMapper: LeagueMapper,
    private seasonMapper: SeasonMapper,
    private route: ActivatedRoute,
    protected myNavigation: MyNavigation,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      start: ['', Validators.compose([
        Validators.required
      ])],
      league: ['', Validators.compose([
        Validators.required
      ])],
      season: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.competitionRepos.getObject(params.id)
        .subscribe(
        /* happy path */(competition: Competition) => {
            this.postInit(competition);
            this.initLeaguesAndSeasons();
          },
        /* error path */ e => { this.processing = false; this.setAlert('danger', e.message); },
        /* onComplete */() => { this.processing = false; }
        );
    });
  }

  private postInit(competition: Competition) {
    if (competition === undefined) {
      return;
    }
    this.competition = competition;
    this.setDate(this.form.controls.start, this.competition.getStartDateTime());
    this.form.controls.league.setValue(this.competition.getLeague());
    this.form.controls.season.setValue(this.competition.getSeason());
  }

  initLeaguesAndSeasons() {
    this.leagueRepos.getObjects()
      .subscribe(
      /* happy path */(leagues: League[]) => {
          this.leagues = leagues;
        },
      /* error path */ e => { this.setAlert('danger', e.message); },
      /* onComplete */() => { }
      );
    this.seasonRepos.getObjects()
      .subscribe(
      /* happy path */(seasons: Season[]) => {
          this.seasons = seasons;
        },
      /* error path */ e => { this.setAlert('danger', e.message); },
      /* onComplete */() => { }
      );
  }

  getDate(dateFormControl: AbstractControl): Date {
    return new Date(dateFormControl.value.year, dateFormControl.value.month - 1, dateFormControl.value.day, 0, 0);
  }

  setDate(dateFormControl: AbstractControl, date: Date) {
    dateFormControl.setValue({ year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() });
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

    const startDateTime = this.getDate(this.form.controls.start).toISOString();
    const league = this.form.controls.league.value;
    const season = this.form.controls.season.value;
    const sport = this.form.controls.sport.value;

    const jsonCompetition: JsonCompetition = {
      league: this.leagueMapper.toJson(league),
      season: this.seasonMapper.toJson(season),
      ruleSet: RankingService.RULESSET_WC,
      startDateTime,
      fields: [],
      referees: [],
      state: State.Created,
      sportConfigs: [this.sportConfigService.createDefaultJson(sport)]
    };
    this.competitionRepos.createObject(jsonCompetition)
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

    const startDateTime = this.getDate(this.form.controls.start);

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

  navigateBack() {
    this.myNavigation.back();
  }

  protected setAlert(type: string, message: string) {
    this.alert = { type, message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }
}
