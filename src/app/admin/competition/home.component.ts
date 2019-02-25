import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Competition, CompetitionRepository } from 'ngx-sport';
import { Subscription } from 'rxjs';

import { IAlert } from '../../app.definitions';

@Component({
  selector: 'app-competition-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class CompetitionHomeComponent implements OnInit, OnDestroy {

  protected sub: Subscription;
  returnUrl: string;
  returnUrlParam: number;
  returnUrlQueryParamKey: string;
  returnUrlQueryParamValue: string;
  public alert: IAlert;
  public processing = true;
  competitions: Competition[];
  competition: Competition;

  constructor(
    private competitionRepos: CompetitionRepository,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.competitionRepos.getObjects()
        .subscribe(
        /* happy path */(competitions: Competition[]) => {
          this.competitions = competitions;
          this.postInit(+params.id);
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private postInit(id: number) {
    if (id === undefined || id < 1) {
      return;
    }
    this.competition = this.competitions.find(competition => competition.getId() === id);
  }

  linkToBasics() {
    this.router.navigate(
      ['/admin/competition/edit', this.competition.getId()],
      {
        queryParams: {
          returnAction: '/admin/competition/home',
          returnParam: this.competition.getId()
        }
      }
    );
  }

  linkToStructure() {
    this.router.navigate(
      ['/admin/structure', this.competition.getId()],
      {
        queryParams: {
          returnAction: '/admin/competition/home',
          returnParam: this.competition.getId()
        }
      }
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

  protected setAlert(type: string, message: string) {
    this.alert = { 'type': type, 'message': message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }
}
