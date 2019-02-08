import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module';
import { Association, AssociationRepository, JsonAssociation, AssociationMapper } from 'ngx-sport';
import { Subscription } from 'rxjs/Subscription';

import { IAlert } from '../../app.definitions';

@Component({
  selector: 'app-association-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class AssociationEditComponent implements OnInit, OnDestroy {

  protected sub: Subscription;
  returnUrl: string;
  returnUrlParam: number;
  returnUrlQueryParamKey: string;
  returnUrlQueryParamValue: string;
  public alert: IAlert;
  public processing = true;
  customForm: FormGroup;
  associations: Association[];
  association: Association;

  validations: AssociationValidations = {
    minlengthname: Association.MIN_LENGTH_NAME,
    maxlengthname: Association.MAX_LENGTH_NAME,
    maxlengthdescription: Association.MAX_LENGTH_DESCRIPTION
  };

  constructor(
    private associationRepos: AssociationRepository,
    private associationMapper: AssociationMapper,
    private route: ActivatedRoute,
    private router: Router,
    fb: FormBuilder
  ) {
    this.customForm = fb.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validations.minlengthname),
        Validators.maxLength(this.validations.maxlengthname)
      ])],
      description: ['', Validators.maxLength(this.validations.maxlengthdescription)],
      parent: ['']
    });
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.associationRepos.getObjects()
        .subscribe(
        /* happy path */(associations: Association[]) => {
          this.associations = associations;
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

  private postInit(id: number) {
    if (id === undefined || id < 1) {
      return;
    }
    this.association = this.associations.find(association => association.getId() === id);
    if (this.association === undefined) {
      return;
    }
    // remove association from all associations
    const index = this.associations.indexOf(this.association);
    if (index > -1) {
      this.associations.splice(index, 1);
    }

    this.customForm.controls.name.setValue(this.association.getName());
    this.customForm.controls.description.setValue(this.association.getDescription());
    this.customForm.controls.parent.setValue(this.association.getParent());
  }

  save() {
    if (this.association !== undefined) {
      this.edit();
    } else {
      this.add();
    }
    return false;
  }

  add() {
    this.processing = true;

    const name = this.customForm.controls.name.value;
    const description = this.customForm.controls.description.value;
    const parent = this.customForm.controls.parent.value;

    if (this.isNameDuplicate(this.customForm.controls.name.value)) {
      this.setAlert('danger', 'de naam bestaan al');
      this.processing = false;
      return;
    }
    const association: JsonAssociation = {
      name: name,
      description: description ? description : undefined,
      parent: parent ? this.associationMapper.toJson(parent) : undefined
    };
    this.associationRepos.createObject(association)
      .subscribe(
        /* happy path */ associationRes => {
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
    const description = this.customForm.controls.description.value;
    const parent = this.customForm.controls.parent.value;

    this.association.setName(name);
    this.association.setDescription(description ? description : undefined);
    this.association.setParent(parent ? parent : undefined);

    this.associationRepos.editObject(this.association)
      .subscribe(
        /* happy path */ associationRes => {
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

  isNameDuplicate(name: string): boolean {
    return this.associations.find(associationIt => name === associationIt.getName()) !== undefined;
  }

  getFilteredAssociation() {
    if (this.association === undefined) {
      return this.associations;
    }
    const ancestors = this.association.getAncestors();
    return this.associations.filter(association => {
      return ancestors.find(ancestor => ancestor === association) !== undefined;
    });
  }

  protected setAlert(type: string, message: string) {
    this.alert = { 'type': type, 'message': message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }

  convertDate(dateStruct: NgbDateStruct) {
    return new Date(dateStruct.year, dateStruct.month - 1, dateStruct.day, 0, 0);
  }

  convertDateBack(date: Date) {
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

export interface AssociationValidations {
  maxlengthname: number;
  minlengthname: number;
  maxlengthdescription: number;
}
