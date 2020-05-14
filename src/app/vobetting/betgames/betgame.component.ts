import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Competition, Game, Round, Structure, NameService } from 'ngx-sport';
import { CompetitionRepository } from '../../lib/ngx-sport/competition/repository';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';

import { IAlert } from '../../common/alert';
import { BetLineFilter, BetLineRepository } from '../../lib/betline/repository';
import { MyNavigation } from 'src/app/common/navigation';
import { BetLine } from 'src/app/lib/betline';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SerieRunner, SerieLayBack } from '../betline/series';
import { LayBack } from 'src/app/lib/layback';
import { BettingNameService } from 'src/app/lib/nameservice';

@Component({
  selector: 'app-betgame',
  templateUrl: './betgame.component.html',
  styleUrls: ['./betgame.component.css']
})
export class BetGameComponent implements OnInit {

  public alert: IAlert;
  public processing = true;
  competition: Competition;
  structure: Structure;
  game: Game;
  betLines: BetLine[];
  runnersSerie: SerieRunner[];
  form: FormGroup;

  constructor(
    private competitionRepos: CompetitionRepository,
    private structureRepos: StructureRepository,
    private betLineRepos: BetLineRepository,
    private route: ActivatedRoute,
    private myNavigation: MyNavigation,
    public nameService: NameService,
    public bettingNameService: BettingNameService,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      betline: ['', Validators.compose([
      ])]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.competitionRepos.getObject(params.competitionId)
        .subscribe(
          /* happy path */(competition: Competition) => {
            this.competition = competition;
            this.initStructureAndGame(competition, params.gameId);
            this.onBetLineChange();
          },
          /* error path */ e => { this.processing = false; this.setAlert('danger', e); },
          /* onComplete */() => { this.processing = false; }
        );
    });
  }

  private initStructureAndGame(competition: Competition, gameId: number) {
    this.structureRepos.getObject(competition)
      .subscribe(
        /* happy path */(structure: Structure) => {
          this.structure = structure;
          this.game = structure.getFirstRoundNumber().getGames().find(game => game.getId() == gameId);
          this.getBetLines();
        },
        /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => { }
      );
  }

  private getBetLines() {
    this.betLineRepos.getObjects(this.game)
      .subscribe(
        /* happy path */(betLines: BetLine[]) => {
          this.betLines = betLines;
          this.processing = false;
        },
        /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => { }
      );
  }

  navigateBack() {
    this.myNavigation.back();
  }

  get MatchOdds() { return BetLine.MATCH_ODDS; }
  get GameHOME(): boolean { return Game.HOME; }
  get GameAWAY(): boolean { return Game.AWAY; }

  protected setAlert(type: string, message: string) {
    this.alert = { type, message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }

  onBetLineChange(): void {
    this.form.get('betline').valueChanges.subscribe(val => {
      this.runnersSerie = this.getRunnersSeries(this.form.controls.betline.value);
    });
  }

  getRunnersSeries(betLine: BetLine): SerieRunner[] {
    const runnersSerie: SerieRunner[] = [];

    betLine.getLayBacks().forEach((layBack: LayBack) => {
      if (layBack.getPrice() > 8) {
        return;
      }
      let runnerSerie = runnersSerie.find(runnerSerieIt => runnerSerieIt.runner === layBack.getRunner())
      if (runnerSerie === undefined) {
        runnerSerie = { runner: layBack.getRunner(), layBackSeries: [] };
        runnersSerie.push(runnerSerie);
      }
      const layBacksSerie = runnerSerie.layBackSeries;
      let layBackSerie = layBacksSerie.find(layBackSerieIt => layBackSerieIt.layOrBack === layBack.getBack())
      if (layBackSerie === undefined) {
        layBackSerie = { layOrBack: layBack.getBack(), bookmakers: [] };
        layBacksSerie.push(layBackSerie);
      }
      const bookmakersSeries = layBackSerie.bookmakers;
      let bookmakerSerie = bookmakersSeries.find(bookmakerSerieIt => bookmakerSerieIt.bookmaker.getId() === layBack.getBookmaker().getId())
      if (bookmakerSerie === undefined) {
        bookmakerSerie = { bookmaker: layBack.getBookmaker(), layBacks: [] };
        bookmakersSeries.push(bookmakerSerie);
      }
      const seriesData = bookmakerSerie.layBacks;
      const serieData = seriesData.find(serieDataIt => serieDataIt.name.getTime() === layBack.getDateTime().getTime())
      if (serieData === undefined) {
        seriesData.push({ name: layBack.getDateTime(), value: layBack.getPrice() });
      }

    });
    return runnersSerie;
  }

  getChartTitle(betType: number, runnerSerie: SerieRunner): string {
    return this.bettingNameService.getRunnerDescription(betType, runnerSerie.runner);
  }
}
