import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AssociationRepository,
  Competition,
  CompetitionRepository,
  PoulePlace,
  PoulePlaceRepository,
  Round,
  StructureRepository,
  StructureService,
  Team,
  TeamRepository,
} from 'ngx-sport';
import { Subscription } from 'rxjs/Subscription';

import { IAlert } from '../../app.definitions';

@Component({
  selector: 'app-pouleplace-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class PoulePlaceEditComponent implements OnInit, OnDestroy {

  protected sub: Subscription;
  returnUrl: string;
  returnUrlParam: number;
  returnUrlQueryParamKey: string;
  returnUrlQueryParamValue: string;
  public alert: IAlert;
  public processing = true;
  customForm: FormGroup;
  teams: Team[];
  team: Team;
  poulePlace: PoulePlace;
  competition: Competition;
  structureService: StructureService;

  constructor(
    private teamRepos: TeamRepository,
    private competitionRepos: CompetitionRepository,
    private associationRepos: AssociationRepository,
    private pouleplaceRepos: PoulePlaceRepository,
    private structureRepository: StructureRepository,
    private route: ActivatedRoute,
    private router: Router,
    fb: FormBuilder
  ) {
    this.customForm = fb.group({
      team: ['']
    });
  }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.competitionRepos.getObject(+params.competitionid)
        .subscribe(
        /* happy path */(competition: Competition) => {
          this.competition = competition;

          this.teamRepos.getObjects(this.competition.getLeague().getAssociation())
            .subscribe(
            /* happy path */(teams: Team[]) => {
              this.teams = teams;

            },
            /* error path */ e => { },
            /* onComplete */() => { this.processing = false; }
            );

          this.structureRepository.getObject(this.competition)
            .subscribe(
              /* happy path */(roundRes: Round) => {
              this.structureService = new StructureService(
                this.competition,
                { min: 2, max: 64 },
                roundRes
              );
              this.postInit(+params.id);

            },
            /* error path */ e => { },
            /* onComplete */() => { }
            );
        },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
        );
    });

    this.route.queryParamMap.subscribe(params => {
      this.returnUrl = params.get('returnAction');
      if (params.get('returnParam') !== null) {
        this.returnUrlParam = +params.get('returnParam');
      }
      this.returnUrlQueryParamKey = params.get('returnQueryParamKey');
      this.returnUrlQueryParamValue = params.get('returnQueryParamValue');
    });
  }

  getPoulePlaces() {
    return this.structureService.getFirstRound().getPoules()[0].getPlaces();
  }

  private postInit(id: number) {
    if (id === undefined || id < 1) {
      return;
    }
    this.poulePlace = this.getPoulePlaces().find(pouleplace => pouleplace.getId() === id);
    if (this.poulePlace !== undefined) {
      this.customForm.controls.team.setValue(this.poulePlace.getTeam());
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  save() {
    this.processing = true;

    const team = this.customForm.controls.team.value;

    // if (this.isTeamDuplicate(team)) {
    //   this.setAlert('danger', 'de naam bestaan al');
    //   this.processing = false;
    //   return;
    // }


    this.poulePlace.setTeam(team);

    this.pouleplaceRepos.editObject(this.poulePlace, this.poulePlace.getPoule())
      .subscribe(
        /* happy path */ poulePlaceRes => {
        this.navigateBack();
      },
        /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => { this.processing = false; }
      );
  }

  private getForwarUrl() {
    if (this.returnUrlParam !== undefined) {
      return [this.returnUrl, this.returnUrlParam];
    }
    return [this.returnUrl];
  }

  private getForwarUrlQueryParams(): {} {
    const queryParams = {};
    queryParams[this.returnUrlQueryParamKey] = this.returnUrlQueryParamValue;
    return queryParams;
  }

  navigateBack() {
    this.router.navigate(this.getForwarUrl(), { queryParams: this.getForwarUrlQueryParams() });
  }

  // isTeamDuplicate(team: Team): boolean {
  //   return this.teams.find(teamIt => {
  //     return (name === teamIt.getName() && (team === undefined || team !== teamIt));
  //   }) !== undefined;
  // }

  protected setAlert(type: string, message: string) {
    this.alert = { 'type': type, 'message': message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }
}
