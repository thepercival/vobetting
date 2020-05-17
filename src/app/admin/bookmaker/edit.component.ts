import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module';
import { BookmakerMapper, JsonBookmaker } from '../../lib/bookmaker/mapper';
import { Bookmaker } from '../../lib/bookmaker';
import { BookmakerRepository } from '../../lib/bookmaker/repository';
import { Subscription } from 'rxjs';

import { IAlert } from '../../common/alert';
import { MyNavigation } from 'src/app/common/navigation';

@Component({
  selector: 'app-bookmaker-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class BookmakerEditComponent implements OnInit {
  public alert: IAlert;
  public processing = true;
  form: FormGroup;
  bookmakers: Bookmaker[];
  bookmaker: Bookmaker;
  validations: BookmakerValidations = {
    minlengthname: 1,
    maxlengthname: Bookmaker.MAX_LENGTH_NAME,
    maxlengthfee: 4
  };

  constructor(
    private bookmakerRepos: BookmakerRepository,
    private route: ActivatedRoute,
    protected myNavigation: MyNavigation,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validations.minlengthname),
        Validators.maxLength(this.validations.maxlengthname)
      ])],
      exchange: false,
      fee: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(this.validations.maxlengthfee)
      ])],
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.bookmakerRepos.getObjects()
        .subscribe(
        /* happy path */(bookmakers: Bookmaker[]) => {
            this.bookmakers = bookmakers;
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
    this.bookmaker = this.bookmakers.find(bookmaker => bookmaker.getId() === id);
    if (this.bookmaker === undefined) {
      return;
    }
    // remove bookmaker from all bookmakers
    const index = this.bookmakers.indexOf(this.bookmaker);
    if (index > -1) {
      this.bookmakers.splice(index, 1);
    }

    this.form.controls.name.setValue(this.bookmaker.getName());
    this.form.controls.exchange.setValue(this.bookmaker.getExchange());
    this.form.controls.fee.setValue(this.bookmaker.getFeePercentage());
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

    const name = this.form.controls.name.value;
    const exchange = this.form.controls.exchange.value;
    const feePercentage = this.form.controls.fee.value;

    if (this.isNameDuplicate(this.form.controls.name.value)) {
      this.setAlert('danger', 'de naam bestaan al');
      this.processing = false;
      return;
    }
    const bookmaker: JsonBookmaker = { name, exchange, feePercentage };
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

    if (this.isNameDuplicate(this.form.controls.name.value)) {
      this.setAlert('danger', 'de naam bestaan al');
      this.processing = false;
      return;
    }
    const name = this.form.controls.name.value;
    const exchange = this.form.controls.exchange.value;
    const feePercentage = this.form.controls.fee.value;

    this.bookmaker.setName(name);
    this.bookmaker.setExchange(exchange);
    this.bookmaker.setFeePercentage(feePercentage);

    this.bookmakerRepos.editObject(this.bookmaker)
      .subscribe(
        /* happy path */ bookmakerRes => {
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
    return this.bookmakers.find(bookmakerIt => name === bookmakerIt.getName()) !== undefined;
  }

  protected setAlert(type: string, message: string) {
    this.alert = { type, message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }
}

export interface BookmakerValidations {
  maxlengthname: number;
  minlengthname: number;
  maxlengthfee: number;
}
