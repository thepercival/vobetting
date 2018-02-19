import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ExternalObject,
  ExternalObjectRepository,
  ExternalSystem,
  ExternalSystemRepository,
  IExternalObject,
  Team,
  TeamRepository,
} from 'ngx-sport';
import { Subscription } from 'rxjs/Subscription';

import { IAlert } from '../../app.definitions';

@Component({
  selector: 'app-team-extern',
  templateUrl: './extern.component.html'/*,
  styleUrls: ['./edit.component.css']*/
})
export class TeamExternComponent implements OnInit, OnDestroy {

  protected sub: Subscription;
  returnUrl: string;
  returnUrlParam: number;
  returnUrlQueryParamKey: string;
  returnUrlQueryParamValue: string;
  public alert: IAlert;
  public processing = true;
  customForm: FormGroup;
  team: Team;
  externalSystems: ExternalSystem[];
  externalObject: ExternalObject;

  validations: ImportableObjectValidations = {
    maxlengthexternalid: ExternalObject.MAX_LENGTH_EXTERNALID
  };

  constructor(
    private teamRepos: TeamRepository,
    private externalSystemRepos: ExternalSystemRepository,
    private externalObjectRepos: ExternalObjectRepository,
    private route: ActivatedRoute,
    private router: Router,
    fb: FormBuilder
  ) {

    this.externalObjectRepos.setUrlpostfix(this.teamRepos);
    this.customForm = fb.group({
      name: ['', Validators.compose([
        Validators.required
      ])],
      externalSystem: ['', Validators.compose([
        Validators.required
      ])],
      externalId: ['', Validators.compose([
        Validators.required, Validators.maxLength(this.validations.maxlengthexternalid)
      ])]
    });
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.externalSystemRepos.getObjects()
        .subscribe(
        /* happy path */(externalSystems: ExternalSystem[]) => {
          this.externalSystems = externalSystems;
        },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
        );

      this.teamRepos.getObject(+params.id)
        .subscribe(
        /* happy path */(team: Team) => {
          this.team = team;
          this.customForm.controls.name.setValue(this.team.getName());
          this.customForm.controls.name.disable();
        },
        /* error path */ e => { this.processing = false; },
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

  getExternalObject(externalSystem: ExternalSystem) {
    this.processing = true;
    this.externalObjectRepos.getObject(this.team, externalSystem)
      .subscribe(
        /* happy path */(externalObject: ExternalObject) => {
        this.externalObject = externalObject;
        if (this.externalObject !== undefined) {
          this.customForm.controls.externalId.setValue(this.externalObject.getExternalId());
        }
      },
        /* error path */ e => { this.processing = false; },
        /* onComplete */() => { this.processing = false; }
      );
  }

  save() {
    if (this.externalObject !== undefined) {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    this.processing = true;

    const externalSystem = this.customForm.controls.externalSystem.value;
    const externalId = this.customForm.controls.externalId.value;

    const externalObject: IExternalObject = {
      importableObjectId: this.team.getId(),
      externalSystemId: externalSystem.getId(),
      externalId: externalId

    };
    this.externalObjectRepos.createObject(externalObject)
      .subscribe(
        /* happy path */ externalObjectRes => {
        this.navigateBack();
      },
        /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => this.processing = false
      );
  }

  edit() {
    this.processing = true;

    const externalId = this.customForm.controls.externalId.value;
    this.externalObject.setExternalId(externalId);
    this.externalObjectRepos.editObject(this.externalObject)
      .subscribe(
        /* happy path */ externalObjectRes => {
        this.navigateBack();
      },
        /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => this.processing = false
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

interface ImportableObjectValidations {
  maxlengthexternalid: number;
}