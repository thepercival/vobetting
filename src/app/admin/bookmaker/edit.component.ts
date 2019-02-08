import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { IAlert } from '../../app.definitions';
import { Bookmaker } from '../../vobetting/bookmaker';
import { BookmakerRepository, IBookmaker } from '../../vobetting/bookmaker/repository';

@Component({
  selector: 'app-bookmaker-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class BookmakerEditComponent implements OnInit, OnDestroy {

  protected sub: Subscription;
  returnUrl: string;
  returnUrlParam: number;
  returnUrlQueryParamKey: string;
  returnUrlQueryParamValue: string;
  public alert: IAlert;
  public processing = true;
  customForm: FormGroup;
  bookmakers: Bookmaker[];
  bookmaker: Bookmaker;

  validations: BookmakerValidations = {
    maxlengthname: Bookmaker.MAX_LENGTH_NAME
  };

  constructor(
    private bookmakerRepos: BookmakerRepository,
    private route: ActivatedRoute,
    private router: Router,
    fb: FormBuilder
  ) {
    this.customForm = fb.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(this.validations.maxlengthname)])],
      exchange: ['']
    });
  }

  // initialsValidator(control: FormControl): { [s: string]: boolean } {
  //     if (control.value.length < this.validations.minlengthinitials || control.value.length < this.validations.maxlengthinitials) {
  //         return { invalidInitials: true };
  //     }
  // }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.bookmakerRepos.getObjects()
        .subscribe(
        /* happy path */(bookmakers: Bookmaker[]) => {
            this.bookmakers = bookmakers;
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
    this.bookmaker = this.bookmakers.find(bookmaker => bookmaker.getId() === id);
    if (this.bookmaker === undefined) {
      return;
    }
    this.customForm.controls.name.setValue(this.bookmaker.getName());
    this.customForm.controls.exchange.setValue(this.bookmaker.getExchange());
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  save() {
    if (this.bookmaker !== undefined) {
      this.edit();
    } else {
      this.add();
    }
    return false;
  }

  add() {
    this.processing = true;

    const name = this.customForm.controls.name.value;
    const exchange = this.customForm.controls.exchange.value;

    if (this.isNameDuplicate(this.customForm.controls.name.value)) {
      this.setAlert('danger', 'de naam bestaan al');
      this.processing = false;
      return;
    }
    const bookmaker: IBookmaker = {
      name: name,
      exchange: exchange
    };
    this.bookmakerRepos.createObject(bookmaker)
      .subscribe(
        /* happy path */ bookmakerRes => {
          this.navigateBack();
        },
        /* error path */ e => { this.setAlert('danger', e); },
        /* onComplete */() => this.processing = false
      );
  }

  edit() {
    this.processing = true;

    if (this.isNameDuplicate(this.customForm.controls.name.value, this.bookmaker)) {
      this.setAlert('danger', 'de naam bestaan al');
      this.processing = false;
      return;
    }
    const name = this.customForm.controls.name.value;
    const exchange = this.customForm.controls.exchange.value;

    this.bookmaker.setName(name);
    this.bookmaker.setExchange(exchange);

    this.bookmakerRepos.editObject(this.bookmaker)
      .subscribe(
        /* happy path */ bookmakerRes => {
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

  isNameDuplicate(name: string, bookmaker?: Bookmaker): boolean {
    return this.bookmakers.find(bookmakerIt => {
      return (name === bookmakerIt.getName() && (bookmaker === undefined || bookmaker !== bookmakerIt));
    }) !== undefined;
  }

  protected setAlert(type: string, message: string) {
    this.alert = { 'type': type, 'message': message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }
}

export interface BookmakerValidations {
  maxlengthname: number;
}
