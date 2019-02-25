import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AssociationRepository,
  Competition,
  CompetitionRepository,
  CompetitorRepository,
  Game,
  GameRepository,
  PlanningService,
  Poule,
  PoulePlaceRepository,
  Structure,
  StructureRepository,
} from 'ngx-sport';
import { Subscription } from 'rxjs';

import { IAlert } from '../../app.definitions';

@Component({
  selector: 'app-game-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class GameListComponent implements OnInit, OnDestroy {

  games: Game[];
  alert: IAlert;
  processing = true;
  protected sub: Subscription;
  competition: Competition;
  private structure: Structure;

  constructor(
    private competitorRepos: CompetitorRepository,
    private competitionRepos: CompetitionRepository,
    private associationRepos: AssociationRepository,
    private pouleplaceRepos: PoulePlaceRepository,
    private structureRepository: StructureRepository,
    private route: ActivatedRoute,
    private router: Router,
    private gameRepos: GameRepository
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.competitionRepos.getObject(+params.id)
        .subscribe(
        /* happy path */(competition: Competition) => {
            this.competition = competition;
            this.structureRepository.getObject(this.competition)
              .subscribe(
              /* happy path */(structure: Structure) => {
                  this.structure = structure;
                },
            /* error path */ e => { },
            /* onComplete */() => { }
              );
          },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
        );
    });
    // this.gameRepos.getObjects()
    //   .subscribe(
    //     /* happy path */(games: Game[]) => {
    //     this.games = games;
    //   },
    //     /* error path */ e => { },
    //     /* onComplete */() => { this.processing = false; }
    //   );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getPoule(): Poule {
    if (this.structure === undefined) {
      return undefined;
    }
    return this.structure.getRootRound().getPoules()[0];
  }

  allPoulePlaceHaveCompetitor() {
    return !this.getPoule().getPlaces().some(poulePlace => poulePlace.getCompetitor() === undefined);
  }

  create() {
    const planningService = new PlanningService(this.competition);
    planningService.create(this.structure.getRootRound().getNumber());

    this.structureRepository.editObject(this.structure, this.competition)
      .subscribe(
            /* happy path */ structureRes => {
          this.structure = structureRes;
          // console.log(structure);
          // this.router.navigate(['/toernooi/home', tournamentOut.getId()]);
        },
            /* error path */ e => { /*this.error = e;*/ this.processing = false; },
            /* onComplete */() => this.processing = false
      );
  }
  remove(game: Game) {
    this.setAlert('info', 'bond verwijderen..');
    this.processing = true;

    // this.gameRepos.removeObject(game)
    //   .subscribe(
    //     /* happy path */ gameRes => {
    //     const index = this.games.indexOf(game);
    //     if (index > -1) {
    //       this.games.splice(index, 1);
    //     }
    //     this.resetAlert();
    //   },
    //     /* error path */ e => { this.setAlert('danger', 'X' + e); this.processing = false; },
    //     /* onComplete */() => this.processing = false
    //   );
  }

  protected setAlert(type: string, message: string) {
    this.alert = { 'type': type, 'message': message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }

}
