import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Competitionseason, CompetitionseasonRepository, Round, StructureRepository, StructureService } from 'ngx-sport';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { IAlert } from '../../app.definitions';
import { BetLine } from '../betline';
import { BetLineFilter, BetLineRepository } from './repository';

@Component({
  selector: 'app-betline-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class BetLineMainComponent implements OnInit, OnDestroy {

  // protected sub: Subscription;
  // returnUrl: string;
  // returnUrlParam: number;
  // returnUrlQueryParamKey: string;
  // returnUrlQueryParamValue: string;
  public alert: IAlert;
  public processing = true;
  competitionseasons: Competitionseason[];
  // competitionseason: Competitionseason;
  betLines: BetLine[];


  constructor(
    private competitionseasonRepos: CompetitionseasonRepository,
    private structureRepository: StructureRepository,
    private betLineRepository: BetLineRepository,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.competitionseasonRepos.getObjects()
      .subscribe(
        /* happy path */(competitionseasons: Competitionseason[]) => {
        this.competitionseasons = competitionseasons;
        // this.postInit(+params.id);
      },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
      );

    // this.route.queryParamMap.subscribe(params => {
    //   this.returnUrl = params.get('returnAction');
    //   if (params.get('returnParam') !== null) {
    //     this.returnUrlParam = +params.get('returnParam');
    //   }
    //   this.returnUrlQueryParamKey = params.get('returnQueryParamKey');
    //   this.returnUrlQueryParamValue = params.get('returnQueryParamValue');
    // });
  }

  ngOnDestroy() {
    //   this.sub.unsubscribe();
  }

  processBetLinesFilter(betLineFilter: BetLineFilter) {
    console.log('emitted follows');
    this.structureRepository.getObject(betLineFilter.competitionseason)
      .subscribe(
        /* happy path */(round: Round) => {
        const structureService = new StructureService(
          betLineFilter.competitionseason,
          { min: 2, max: 64 },
          round
        );
        const betLinesUpdates: Observable<BetLine[]>[] = [];
        const games = this.getAllGames(structureService.getFirstRound(), betLineFilter.startDateTime, betLineFilter.endDateTime);
        games.forEach(game => {
          betLinesUpdates.push(this.betLineRepository.getObjects(game, betLineFilter));

        });
        this.processBetLinesFilterHelper(betLinesUpdates);
      },
      /* error path */ e => { },
      /* onComplete */() => { }
      );
  }

  getAllGames(round: Round, startDateTime: Date, endDateTime: Date) {
    let games = [];
    round.getPoules().forEach(poule => {
      games = games.concat(poule.getGames().filter(
        game => game.getStartDateTime() > startDateTime && game.getStartDateTime() < endDateTime
      ));
    });
    round.getChildRounds().forEach((childRound) => {
      games = games.concat(this.getAllGames(childRound, startDateTime, endDateTime));
    });
    return games;
  }



  protected processBetLinesFilterHelper(reposSearches: Observable<BetLine[]>[]) {
    forkJoin(reposSearches).subscribe(results => {
      console.log(results);
      this.processing = false;
    },
      err => {
        this.setAlert('danger', 'volgorde niet gewijzigd: ' + err);
        this.processing = false;
      }
    );
  }

  // private postInit(id: number) {
  //   if (id === undefined || id < 1) {
  //     return;
  //   }
  //   this.competitionseason = this.competitionseasons.find(competitionseason => competitionseason.getId() === id);
  // }

  // linkToBasics() {
  //   this.router.navigate(
  //     ['/admin/competitionseason/edit', this.competitionseason.getId()],
  //     {
  //       queryParams: {
  //         returnAction: '/admin/competitionseason/home',
  //         returnParam: this.competitionseason.getId()
  //       }
  //     }
  //   );
  // }

  // linkToStructure() {
  //   this.router.navigate(
  //     ['/admin/structure', this.competitionseason.getId()],
  //     {
  //       queryParams: {
  //         returnAction: '/admin/competitionseason/home',
  //         returnParam: this.competitionseason.getId()
  //       }
  //     }
  //   );
  // }

  // private getForwarUrl() {
  //   if (this.returnUrlParam !== undefined) {
  //     return [this.returnUrl, this.returnUrlParam];
  //   }
  //   return [this.returnUrl];
  // }

  // private getForwarUrlQueryParams(): {} {
  //   const queryParams = {};
  //   queryParams[this.returnUrlQueryParamKey] = this.returnUrlQueryParamValue;
  //   return queryParams;
  // }

  // navigateBack() {
  //   this.router.navigate(this.getForwarUrl(), { queryParams: this.getForwarUrlQueryParams() });
  // }

  protected setAlert(type: string, message: string) {
    this.alert = { 'type': type, 'message': message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }
}
