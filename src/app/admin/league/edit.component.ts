import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module';
import { League, LeagueMapper, JsonLeague, AssociationMapper } from 'ngx-sport';
import { LeagueRepository } from '../../lib/ngx-sport/league/repository';
import { Subscription } from 'rxjs';

import { IAlert } from '../../common/alert';
import { MyNavigation } from 'src/app/common/navigation';

@Component({
  selector: 'app-league-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class LeagueEditComponent implements OnInit {
  public alert: IAlert;
  public processing = true;
  customForm: FormGroup;
  leagues: League[];
  league: League;

  validations: LeagueValidations = {
    minlengthname: League.MIN_LENGTH_NAME,
    maxlengthname: League.MAX_LENGTH_NAME
  };

  constructor(
    private leagueRepos: LeagueRepository,
    private associationMapper: AssociationMapper,
    private route: ActivatedRoute,
    protected myNavigation: MyNavigation,
    fb: FormBuilder
  ) {
    this.customForm = fb.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validations.minlengthname),
        Validators.maxLength(this.validations.maxlengthname)
      ])],
      abbreviation: [''],
      association: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.leagueRepos.getObjects()
        .subscribe(
        /* happy path */(leagues: League[]) => {
            this.leagues = leagues;
            this.postInit(+params.id);
          },
        /* error path */ e => { this.processing = false; this.setAlert('danger', e.message); },
        /* onComplete */() => { this.processing = false; }
        );
    });

  }

  private postInit(id: number) {
    if (id === undefined || id < 1) {
      return;
    }
    this.league = this.leagues.find(league => league.getId() === id);
    if (this.league === undefined) {
      return;
    }
    // remove league from all leagues
    const index = this.leagues.indexOf(this.league);
    if (index > -1) {
      this.leagues.splice(index, 1);
    }

    this.customForm.controls.name.setValue(this.league.getName());
    this.customForm.controls.abbreviation.setValue(this.league.getAbbreviation());
    this.customForm.controls.association.setValue(this.league.getAssociation());
  }

  save() {
    if (this.league !== undefined) {
      this.edit();
    } else {
      this.add();
    }
    return false;
  }

  add() {
    this.processing = true;

    const name = this.customForm.controls.name.value;
    const abbreviation = this.customForm.controls.abbreviation.value;
    const association = this.customForm.controls.association.value;

    if (this.isNameDuplicate(this.customForm.controls.name.value)) {
      this.setAlert('danger', 'de naam bestaan al');
      this.processing = false;
      return;
    }
    const league: JsonLeague = {
      name,
      abbreviation: abbreviation ? abbreviation : undefined,
      association: this.associationMapper.toJson(association)
    };
    this.leagueRepos.createObject(league)
      .subscribe(
        /* happy path */ leagueRes => {
          this.navigateBack();
        },
        /* error path */ e => { this.setAlert('danger', e); },
        /* onComplete */() => this.processing = false
      );
  }

  edit() {
    this.processing = true;

    if (this.isNameDuplicate(this.customForm.controls.name.value)) {
      this.setAlert('danger', 'de naam bestaan al');
      this.processing = false;
      return;
    }
    const name = this.customForm.controls.name.value;
    const abbreviation = this.customForm.controls.abbreviation.value;
    const association = this.customForm.controls.association.value;

    this.league.setName(name);
    this.league.setAbbreviation(abbreviation ? abbreviation : undefined);
    this.league.setAssociation(association);

    this.leagueRepos.editObject(this.league)
      .subscribe(
        /* happy path */ leagueRes => {
          this.navigateBack();
        },
        /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => { this.processing = false; }
      );
  }

  navigateBack() {
    this.myNavigation.back();
  }

  isNameDuplicate(name: string): boolean {
    return this.leagues.find(leagueIt => name === leagueIt.getName()) !== undefined;
  }

  getFilteredLeague() {
    if (this.league === undefined) {
      return this.leagues;
    }
    // const ancestors = this.league.getAncestors();
    // return this.leagues.filter(league => {
    //   return ancestors.find(ancestor => ancestor === league) !== undefined;
    // });
  }

  protected setAlert(type: string, message: string) {
    this.alert = { type, message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }
}

export interface LeagueValidations {
  maxlengthname: number;
  minlengthname: number;
}
