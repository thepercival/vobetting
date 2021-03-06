import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module';
import { Association, AssociationMapper, JsonAssociation } from 'ngx-sport';
import { AssociationRepository } from '../../lib/ngx-sport/association/repository';
import { Subscription } from 'rxjs';

import { IAlert } from '../../common/alert';
import { MyNavigation } from 'src/app/common/navigation';

@Component({
  selector: 'app-association-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class AssociationEditComponent implements OnInit {
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
    protected myNavigation: MyNavigation,
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
    this.route.params.subscribe(params => {
      this.associationRepos.getObjects()
        .subscribe(
        /* happy path */(associations: Association[]) => {
            this.associations = associations;
            this.postInit(+params.id);
          },
        /* error path */ e => { this.processing = false; this.setAlert('danger', e); },
        /* onComplete */() => { this.processing = false; }
        );
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
      name,
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

  navigateBack() {
    this.myNavigation.back();
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
    this.alert = { type, message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }
}

export interface AssociationValidations {
  maxlengthname: number;
  minlengthname: number;
  maxlengthdescription: number;
}
