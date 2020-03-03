import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module';
import { Competition, League } from 'ngx-sport';

import { IAlert } from '../../common/alert';
import { BetLine } from '../../lib/betline';
import { BetLineFilter } from '../../lib/betline/repository';

@Component({
  selector: 'app-betline-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class BetLineSelectionComponent implements OnInit, OnDestroy {

  @Input() competitions: Competition[];
  @Output() processBetLinesFilter = new EventEmitter<BetLineFilter>();

  // games: Game[];
  alert: IAlert;
  public processing = false;
  customForm: FormGroup;
  // protected sub: Subscription;
  // competition: Competition;
  // structureService: StructureService;

  constructor(
    // private competitorRepos: CompetitorRepository,
    // private competitionRepos: CompetitionRepository,
    // private associationRepos: AssociationRepository,
    // private pouleplaceRepos: PoulePlaceRepository,
    // private structureRepository: StructureRepository,
    // private route: ActivatedRoute,
    // private router: Router,
    fb: FormBuilder
  ) {
    this.customForm = fb.group({
      league: ['', Validators.compose([
        Validators.required
      ])],
      competition: ['', Validators.compose([
        Validators.required
      ])],
      endDateTime: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.customForm.controls.league.setValue(this.competitions[0].getLeague());
    this.customForm.controls.competition.setValue(this.competitions[0]);
    const date = new Date(); date.setDate(date.getDate() + 7);
    this.customForm.controls.endDateTime.setValue(this.convertDateBack(date));

    // this.sub = this.route.params.subscribe(params => {
    //   this.competitionRepos.getObject(+params.id)
    //     .subscribe(
    //     /* happy path */(competition: Competition) => {
    //       this.competition = competition;
    //       this.structureRepository.getObject(this.competition)
    //         .subscribe(
    //           /* happy path */(round: Round) => {
    //           if (round !== undefined) {
    //             this.structureService = new StructureService(
    //               this.competition,
    //               { min: 2, max: 64 },
    //               round
    //             );
    //           }
    //         },
    //         /* error path */ e => { },
    //         /* onComplete */() => { }
    //         );
    //     },
    //     /* error path */ e => { },
    //     /* onComplete */() => { this.processing = false; }
    //     );
    // });
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
    // this.sub.unsubscribe();
  }

  getLeagues(): League[] {
    return this.competitions.map(competition => competition.getLeague());
  }

  // (ngModelChange)="updateStartDateTime($event)"

  getCompetitions(): Competition[] {
    const selectedLeague = this.customForm.controls.league.value;
    return this.competitions.filter(competition => competition.getLeague() === selectedLeague).sort((c1, c2) => {
      return c1.getSeason().getStartDateTime() < c2.getSeason().getStartDateTime() ? 1 : -1;
    });
  }

  process() {
    const competition = this.customForm.controls.competition.value;
    const startDateTime = new Date();
    const endDateTime = this.convertDate(this.customForm.controls.endDateTime.value);
    const betType = BetLine.MATCH_ODDS;

    const betLineFilter: BetLineFilter = { competition, startDateTime, endDateTime, betType };
    console.log('emitted');
    this.processBetLinesFilter.emit(betLineFilter);
    return false;
  }

  // getPoule(): Poule {
  //   if (this.structureService === undefined) {
  //     return undefined;
  //   }
  //   return this.structureService.getFirstRound().getPoules()[0];
  // }

  // allPoulePlaceHaveCompetitor() {
  //   return !this.getPoule().getPlaces().some(poulePlace => poulePlace.getCompetitor() === undefined);
  // }

  // create() {
  //   const planningService = new PlanningService(this.structureService);
  //   planningService.create(this.structureService.getFirstRound().getNumber());

  //   this.structureRepository.editObject(this.structureService.getFirstRound(), this.competition)
  //     .subscribe(
  //           /* happy path */ roundRes => {
  //       this.structureService = new StructureService(
  //         this.competition,
  //         { min: 2, max: 64 },
  //         roundRes
  //       );
  //       // console.log(structure);
  //       // this.router.navigate(['/toernooi/home', tournamentOut.getId()]);
  //     },
  //           /* error path */ e => { /*this.error = e;*/ this.processing = false; },
  //           /* onComplete */() => this.processing = false
  //     );
  // }
  // remove(game: Game) {
  //   this.setAlert('info', 'bond verwijderen..');
  //   this.processing = true;

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
  // }

  // protected setAlert(type: string, message: string) {
  //   this.alert = { 'type': type, 'message': message };
  // }

  // protected resetAlert(): void {
  //   this.alert = undefined;
  // }

  convertDate(dateStruct: NgbDateStruct) {
    return new Date(dateStruct.year, dateStruct.month - 1, dateStruct.day, 0, 0);
  }

  convertDateBack(date: Date) {
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }
}


