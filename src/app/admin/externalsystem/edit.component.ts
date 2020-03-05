import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExternalSystem, JsonExternalSystem } from 'ngx-sport';
import { ExternalSystemRepository } from '../../lib/ngx-sport/external/system/repository';
import { Subscription } from 'rxjs';

import { IAlert } from '../../common/alert';
import { MyNavigation } from 'src/app/common/navigation';

@Component({
  selector: 'app-externalsystem-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class ExternalSystemEditComponent implements OnInit, OnDestroy {

  protected sub: Subscription;
  public alert: IAlert;
  public processing = true;
  customForm: FormGroup;
  externalSystems: ExternalSystem[];
  externalSystem: ExternalSystem;

  validations: ExternalSystemValidations = {
    maxlengthname: ExternalSystem.MAX_LENGTH_NAME,
    maxlengthwebsite: ExternalSystem.MAX_LENGTH_WEBSITE,
    maxlengthusername: ExternalSystem.MAX_LENGTH_USERNAME,
    maxlengthpassword: ExternalSystem.MAX_LENGTH_PASSWORD,
    maxlengthapiurl: ExternalSystem.MAX_LENGTH_APIURL,
    maxlengthapikey: ExternalSystem.MAX_LENGTH_APIKEY
  };

  constructor(
    private externalSystemRepos: ExternalSystemRepository,
    private route: ActivatedRoute,
    private router: Router,
    protected myNavigation: MyNavigation,
    fb: FormBuilder
  ) {
    this.customForm = fb.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(this.validations.maxlengthname)])],
      website: ['', Validators.compose([Validators.maxLength(this.validations.maxlengthwebsite)])],
      username: ['', Validators.compose([Validators.maxLength(this.validations.maxlengthusername)])],
      password: ['', Validators.compose([Validators.maxLength(this.validations.maxlengthpassword)])],
      apiurl: ['', Validators.compose([Validators.maxLength(this.validations.maxlengthapiurl)])],
      apikey: ['', Validators.compose([Validators.maxLength(this.validations.maxlengthapikey)])],
    });
  }

  // initialsValidator(control: FormControl): { [s: string]: boolean } {
  //     if (control.value.length < this.validations.minlengthinitials || control.value.length < this.validations.maxlengthinitials) {
  //         return { invalidInitials: true };
  //     }
  // }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.externalSystemRepos.getObjects()
        .subscribe(
        /* happy path */(externalSystems: ExternalSystem[]) => {
            this.externalSystems = externalSystems;
            this.postInit(+params.id);
          },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
        );
    });
  }

  private postInit(id: number) {
    if (id === undefined || id < 1) {
      return;
    }
    this.externalSystem = this.externalSystems.find(externalSystem => externalSystem.getId() === id);
    if (this.externalSystem === undefined) {
      return;
    }
    this.customForm.controls.name.setValue(this.externalSystem.getName());
    this.customForm.controls.website.setValue(this.externalSystem.getWebsite());
    this.customForm.controls.username.setValue(this.externalSystem.getUsername());
    this.customForm.controls.password.setValue(this.externalSystem.getPassword());
    this.customForm.controls.apiurl.setValue(this.externalSystem.getApiurl());
    this.customForm.controls.apikey.setValue(this.externalSystem.getApikey());
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  save() {
    if (this.externalSystem !== undefined) {
      this.edit();
    } else {
      this.add();
    }
    return false;
  }

  add() {
    this.processing = true;

    const name = this.customForm.controls.name.value;
    const website = this.customForm.controls.website.value;
    const username = this.customForm.controls.username.value;
    const password = this.customForm.controls.password.value;
    const apiurl = this.customForm.controls.apiurl.value;
    const apikey = this.customForm.controls.apikey.value;

    if (this.isNameDuplicate(this.customForm.controls.name.value)) {
      this.setAlert('danger', 'de naam bestaan al');
      this.processing = false;
      return;
    }
    const externalSystem: JsonExternalSystem = {
      name,
      website: website ? website : undefined,
      username: username ? username : undefined,
      password: password ? password : undefined,
      apiurl: apiurl ? apiurl : undefined,
      apikey: apikey ? apikey : undefined
    };
    this.externalSystemRepos.createObject(externalSystem)
      .subscribe(
        /* happy path */ externalSystemRes => {
          this.navigateBack();
        },
        /* error path */ e => { this.setAlert('danger', e); },
        /* onComplete */() => this.processing = false
      );
  }

  edit() {
    this.processing = true;

    if (this.isNameDuplicate(this.customForm.controls.name.value, this.externalSystem)) {
      this.setAlert('danger', 'de naam bestaan al');
      this.processing = false;
      return;
    }
    const name = this.customForm.controls.name.value;
    const website = this.customForm.controls.website.value;
    const username = this.customForm.controls.username.value;
    const password = this.customForm.controls.password.value;
    const apiurl = this.customForm.controls.apiurl.value;
    const apikey = this.customForm.controls.apikey.value;

    this.externalSystem.setName(name);
    this.externalSystem.setWebsite(website ? website : undefined);
    this.externalSystem.setUsername(username ? username : undefined);
    this.externalSystem.setPassword(password ? password : undefined);
    this.externalSystem.setApiurl(apiurl ? apiurl : undefined);
    this.externalSystem.setApikey(apikey ? apikey : undefined);

    this.externalSystemRepos.editObject(this.externalSystem)
      .subscribe(
        /* happy path */ externalSystemRes => {
          this.navigateBack();
        },
        /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => { this.processing = false; }
      );
  }

  navigateBack() {
    this.myNavigation.back();
  }

  isNameDuplicate(name: string, externalSystem?: ExternalSystem): boolean {
    return this.externalSystems.find(externalSystemIt => {
      return (name === externalSystemIt.getName() && (externalSystem === undefined || externalSystem !== externalSystemIt));
    }) !== undefined;
  }

  protected setAlert(type: string, message: string) {
    this.alert = { type, message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }
}

export interface ExternalSystemValidations {
  maxlengthname: number;
  maxlengthwebsite: number;
  maxlengthusername: number;
  maxlengthpassword: number;
  maxlengthapiurl: number;
  maxlengthapikey: number;
}
