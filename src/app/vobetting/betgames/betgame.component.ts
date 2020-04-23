import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Competition, Game, Round, Structure, NameService } from 'ngx-sport';
import { CompetitionRepository } from '../../lib/ngx-sport/competition/repository';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';

import { IAlert } from '../../common/alert';
import { BetLineFilter } from '../../lib/betline/repository';
import { MyNavigation } from 'src/app/common/navigation';
import { BetLine } from 'src/app/lib/betline';

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

  constructor(
    private competitionRepos: CompetitionRepository,
    private structureRepository: StructureRepository,
    private route: ActivatedRoute,
    private router: Router,
    private myNavigation: MyNavigation,
    public nameService: NameService,
  ) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(+params.competitionId);
      console.log(+params.gameId);
      // eerst competitie ophalen +params.competitionId
      // dan structuur
      // dan meteen juiste game selecteren +params.gameId
    });

    // this.competitionRepos.getObjects()
    //   .subscribe(
    //     /* happy path */(competitions: Competition[]) => {
    //       this.competitions = competitions;
    //       // this.postInit(+params.id);
    //     },
    //     /* error path */ e => { },
    //     /* onComplete */() => { this.processing = false; }
    //   );

    // this.route.queryParamMap.subscribe(params => {
    //   this.returnUrl = params.get('returnAction');
    //   if (params.get('returnParam') !== null) {
    //     this.returnUrlParam = +params.get('returnParam');
    //   }
    //   this.returnUrlQueryParamKey = params.get('returnQueryParamKey');
    //   this.returnUrlQueryParamValue = params.get('returnQueryParamValue');
    // });
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
