import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IAlert } from '../../common/alert';
import { MyNavigation } from 'src/app/common/navigation';

import { BetGameRepository, JsonBetGame, JsonBetGameFilter } from 'src/app/lib/betgame/repository';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-betgamelist',
  templateUrl: './betgamelist.component.html',
  styleUrls: ['./betgamelist.component.css']
})
export class BetGameListComponent implements OnInit {
  alert: IAlert;
  processing = true;
  betGames: JsonBetGame[];
  form: FormGroup;
  filter: JsonBetGameFilter;

  constructor(
    private router: Router,
    private betGameRepos: BetGameRepository,
    private myNavigation: MyNavigation,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      start: ['', Validators.compose([
      ])],
      end: ['', Validators.compose([
      ])],
    });
  }

  ngOnInit() {
    const start = new Date();
    start.setHours(start.getHours() - 24);
    const end = new Date();
    end.setHours(end.getHours() + (14 * 24));

    this.setDate(this.form.controls.start, start);
    this.setDate(this.form.controls.end, end);
    this.getBetGames();
    this.onChanges();
  }

  onChanges(): void {
    this.form.get('start').valueChanges.subscribe(val => {
      if (this.form.controls.end.value !== undefined) {
        this.processing = true;
        this.getBetGames();
      }
    });
    this.form.get('end').valueChanges.subscribe(val => {
      if (this.form.controls.start.value !== undefined) {
        this.processing = true;
        this.getBetGames();
      }
    });
  }

  getDate(dateFormControl: AbstractControl): Date {
    return new Date(dateFormControl.value.year, dateFormControl.value.month - 1, dateFormControl.value.day, 0, 0);
  }

  setDate(dateFormControl: AbstractControl, date: Date) {
    dateFormControl.setValue({ year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() });
  }

  protected getBetGames() {
    const start = this.getDate(this.form.controls.start);
    const end = this.getDate(this.form.controls.end);
    if (start > end) {
      this.processing = false;
      return;
    }

    const filter: JsonBetGameFilter = {
      start: start.toISOString(),
      end: end.toISOString()
    };
    this.betGameRepos.getObjects(filter)
      .subscribe(
        /* happy path */(betGames) => {
          this.betGames = betGames;
          this.processing = false;
        }),
        /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => { this.processing = false; }
  }

  linkToBetGame(competitionId: string | number, gameId: string | number) {
    this.router.navigate(['/vobetting/betgame', competitionId, gameId]);
  }

  protected setAlert(type: string, message: string) {
    this.alert = { type, message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }

  navigateBack() {
    this.myNavigation.back();
  }

  // updateLeagueAttacher(league: League) {
  //   const attacher = this.getLeagueAttacher(league);
  //   if (attacher === undefined) {
  //     return;
  //   }
  //   attacher.setExternal(league);
  // }
}


