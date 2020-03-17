import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExternalSourceRepository } from '../../lib/ngx-sport/external/system/repository';
import { Subscription } from 'rxjs';

import { IAlert } from '../../common/alert';
import { MyNavigation } from 'src/app/common/navigation';
import { ExternalSource } from 'src/app/lib/externalsource';
import { JsonExternalSource } from 'src/app/lib/externalsource/source/mapper';

@Component({
  selector: 'app-externalsource-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class ExternalSourceEditComponent implements OnInit, OnDestroy {

  protected sub: Subscription;
  public alert: IAlert;
  public processing = true;
  customForm: FormGroup;
  externalSources: ExternalSource[];
  externalSource: ExternalSource;

  validations: ExternalSourceValidations = {
    maxlengthname: ExternalSource.MAX_LENGTH_NAME,
    maxlengthwebsite: ExternalSource.MAX_LENGTH_WEBSITE,
    maxlengthusername: ExternalSource.MAX_LENGTH_USERNAME,
    maxlengthpassword: ExternalSource.MAX_LENGTH_PASSWORD,
    maxlengthapiurl: ExternalSource.MAX_LENGTH_APIURL,
    maxlengthapikey: ExternalSource.MAX_LENGTH_APIKEY
  };

  constructor(
    private externalSourceRepos: ExternalSourceRepository,
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
      this.externalSourceRepos.getObjects()
        .subscribe(
        /* happy path */(externalSources: ExternalSource[]) => {
            this.externalSources = externalSources;
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
    this.externalSource = this.externalSources.find(externalSource => externalSource.getId() === id);
    if (this.externalSource === undefined) {
      return;
    }
    this.customForm.controls.name.setValue(this.externalSource.getName());
    this.customForm.controls.website.setValue(this.externalSource.getWebsite());
    this.customForm.controls.username.setValue(this.externalSource.getUsername());
    this.customForm.controls.password.setValue(this.externalSource.getPassword());
    this.customForm.controls.apiurl.setValue(this.externalSource.getApiurl());
    this.customForm.controls.apikey.setValue(this.externalSource.getApikey());
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  save() {
    if (this.externalSource !== undefined) {
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
    const externalSource: JsonExternalSource = {
      name,
      implementations: 0,
      website: website ? website : undefined,
      username: username ? username : undefined,
      password: password ? password : undefined,
      apiurl: apiurl ? apiurl : undefined,
      apikey: apikey ? apikey : undefined
    };
    this.externalSourceRepos.createObject(externalSource)
      .subscribe(
        /* happy path */ externalSourceRes => {
          this.navigateBack();
        },
        /* error path */ e => { this.setAlert('danger', e); },
        /* onComplete */() => this.processing = false
      );
  }

  edit() {
    this.processing = true;

    if (this.isNameDuplicate(this.customForm.controls.name.value, this.externalSource)) {
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

    this.externalSource.setName(name);
    this.externalSource.setWebsite(website ? website : undefined);
    this.externalSource.setUsername(username ? username : undefined);
    this.externalSource.setPassword(password ? password : undefined);
    this.externalSource.setApiurl(apiurl ? apiurl : undefined);
    this.externalSource.setApikey(apikey ? apikey : undefined);

    this.externalSourceRepos.editObject(this.externalSource)
      .subscribe(
        /* happy path */ externalSourceRes => {
          this.navigateBack();
        },
        /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => { this.processing = false; }
      );
  }

  navigateBack() {
    this.myNavigation.back();
  }

  isNameDuplicate(name: string, externalSource?: ExternalSource): boolean {
    return this.externalSources.find(externalSourceIt => {
      return (name === externalSourceIt.getName() && (externalSource === undefined || externalSource !== externalSourceIt));
    }) !== undefined;
  }

  protected setAlert(type: string, message: string) {
    this.alert = { type, message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }
}

export interface ExternalSourceValidations {
  maxlengthname: number;
  maxlengthwebsite: number;
  maxlengthusername: number;
  maxlengthpassword: number;
  maxlengthapiurl: number;
  maxlengthapikey: number;
}
