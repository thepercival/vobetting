import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SportScoreConfigService, State, Competition, Structure, NameService, Game, Round, RoundNumber } from 'ngx-sport';
import { CompetitionRepository } from '../../lib/ngx-sport/competition/repository';

import { IAlert } from '../../common/alert';
import { MyNavigation } from 'src/app/common/navigation';
import { StructureRepository } from 'src/app/lib/ngx-sport/structure/repository';

@Component({
  selector: 'app-competition-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class CompetitionGameListComponent implements OnInit {
  public alert: IAlert;
  public processing = true;
  gameDatas: GameData[];
  private sportScoreConfigService: SportScoreConfigService;
  competition: Competition;
  structure: Structure;

  constructor(
    private competitionRepos: CompetitionRepository,
    private structureRepos: StructureRepository,
    private route: ActivatedRoute,
    protected myNavigation: MyNavigation,
    public nameService: NameService
  ) {
    this.sportScoreConfigService = new SportScoreConfigService();
  }

  get GameHOME(): boolean { return Game.HOME; }
  get GameAWAY(): boolean { return Game.AWAY; }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.competitionRepos.getObject(params.id)
        .subscribe(
      /* happy path */(competition: Competition) => {
            this.postInit(competition);
          },
      /* error path */ e => { this.processing = false; this.setAlert('danger', e); },
      /* onComplete */() => { this.processing = false; }
        );
    });
  }

  private postInit(competition: Competition) {

    this.competition = competition;
    this.structureRepos.getObject(competition)
      .subscribe(
        /* happy path */(structure: Structure) => {
          this.structure = structure;
          this.gameDatas = this.getGameData();
          this.processing = false;
        },
        /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => { }
      );

  }

  private getGameData() {
    const gameDatas: GameData[] = [];
    const roundNumber = this.structure.getFirstRoundNumber();
    const pouleDatas = this.getPouleDatas(roundNumber);
    roundNumber.getGames(Game.ORDER_BY_BATCH).forEach(game => {
      const pouleData: PouleData = pouleDatas[game.getPoule().getId()];
      const gameData: GameData = {
        poule: pouleData,
        game,
        isCanceled: game.getState() === State.Canceled
      };
      gameDatas.push(gameData);
    });
    return gameDatas;
  }

  private getPouleDatas(roundNumber: RoundNumber): any {
    const pouleDatas = {};

    roundNumber.getPoules().forEach(poule => {
      pouleDatas[poule.getId()] = {
        name: this.nameService.getPouleName(poule, false),
        needsRanking: poule.needsRanking(),
        round: poule.getRound()
      };
    });
    return pouleDatas;
  }

  getScore(game: Game): string {
    const sScore = ' - ';
    if (game.getState() !== State.Finished) {
      return sScore;
    }
    const finalScore = this.sportScoreConfigService.getFinalScore(game);
    if (finalScore === undefined) {
      return sScore;
    }
    return finalScore.getHome() + sScore + finalScore.getAway();
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

interface GameData {
  poule: PouleData;
  game: Game;
  isCanceled: boolean;
}

interface PouleData {
  name: string;
  needsRanking: boolean;
  round: Round;
}
