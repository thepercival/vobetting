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
  form: FormGroup;

  constructor(
    private competitionRepos: CompetitionRepository,
    private structureRepos: StructureRepository,
    private betLineRepos: BetLineRepository,
    private route: ActivatedRoute,
    private myNavigation: MyNavigation,
    public nameService: NameService,
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

  get GameHOME(): boolean { return Game.HOME; }
  get GameAWAY(): boolean { return Game.AWAY; }

  // processBetLinesFilter(betLineFilter: BetLineFilter) {
  // this.structureRepository.getObject(betLineFilter.competition)
  //   .subscribe(
  //     /* happy path */(structure: Structure) => {
  //       this.structure = structure;
  //       this.betTypes = betLineFilter.betType;
  //       this.games = this.getAllGames(this.structure.getRootRound(), betLineFilter.startDateTime, betLineFilter.endDateTime);
  //     },
  //   /* error path */ e => { },
  //   /* onComplete */() => { }
  //   );
  // }


  // getAllGames(round: Round, startDateTime: Date, endDateTime: Date) {
  //   let games = [];
  //   round.getPoules().forEach(poule => {
  //     games = games.concat(poule.getGames().filter(
  //       game => game.getStartDateTime() > startDateTime && game.getStartDateTime() < endDateTime
  //     ));
  //   });
  //   /*round.getChildRounds().forEach((childRound) => {
  //     games = games.concat(this.getAllGames(childRound, startDateTime, endDateTime));
  //   });*/
  //   return games;
  // }

  // private postInit(id: number) {
  //   if (id === undefined || id < 1) {
  //     return;
  //   }
  //   this.competition = this.competitions.find(competition => competition.getId() === id);
  // }

  // linkToBasics() {
  //   this.router.navigate(
  //     ['/admin/competition/edit', this.competition.getId()],
  //     {
  //       queryParams: {
  //         returnAction: '/admin/competition/home',
  //         returnParam: this.competition.getId()
  //       }
  //     }
  //   );
  // }

  // linkToStructure() {
  //   this.router.navigate(
  //     ['/admin/structure', this.competition.getId()],
  //     {
  //       queryParams: {
  //         returnAction: '/admin/competition/home',
  //         returnParam: this.competition.getId()
  //       }
  //     }
  //   );
  // }

  protected setAlert(type: string, message: string) {
    this.alert = { type, message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }
}
