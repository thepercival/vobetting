import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Competitionseason, CompetitionseasonRepository } from 'ngx-sport';
import { Subscription } from 'rxjs/Subscription';

import { IAlert } from '../../app.definitions';

@Component({
  selector: 'app-competitionseason-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class CompetitionseasonHomeComponent implements OnInit, OnDestroy {

  protected sub: Subscription;
  returnUrl: string;
  returnUrlParam: number;
  returnUrlQueryParamKey: string;
  returnUrlQueryParamValue: string;
  public alert: IAlert;
  public processing = true;
  competitionseasons: Competitionseason[];
  competitionseason: Competitionseason;

  constructor(
    private competitionseasonRepos: CompetitionseasonRepository,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.competitionseasonRepos.getObjects()
        .subscribe(
        /* happy path */(competitionseasons: Competitionseason[]) => {
          this.competitionseasons = competitionseasons;
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
    this.competitionseason = this.competitionseasons.find(competitionseason => competitionseason.getId() === id);
  }

  linkToBasics() {
    this.router.navigate(
      ['/admin/competitionseason/edit', this.competitionseason.getId()],
      {
        queryParams: {
          returnAction: '/admin/competitionseason/home',
          returnParam: this.competitionseason.getId()
        }
      }
    );
  }

  linkToStructure() {
    this.router.navigate(
      ['/admin/structure', this.competitionseason.getId()],
      {
        queryParams: {
          returnAction: '/admin/competitionseason/home',
          returnParam: this.competitionseason.getId()
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
