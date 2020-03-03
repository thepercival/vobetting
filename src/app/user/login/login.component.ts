import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../auth/auth.service';
import { IAlert } from '../../common/alert';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  alert: IAlert;
  registered = false;
  processing = true;
  form: FormGroup;

  validations: any = {
    minlengthpassword: 3,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validations.minlengthpassword)
      ])],

    });
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
      (param: any) => {
        if (param.message !== undefined) {
          this.setAlert('info', param.message);
        }
      });
    if (this.isLoggedIn() === true) {
      this.setAlert('danger', 'je bent al ingelogd');
    }
    this.processing = false;
  }

  protected setAlert(type: string, message: string) {
    this.alert = { type, message };
  }

  protected resetAlert() {
    this.alert = undefined;
  }

  login(): boolean {
    this.processing = true;
    this.setAlert('info', 'je wordt ingelogd');

    const password = this.form.controls.password.value;

    this.authService.login(password)
      .subscribe(
            /* happy path */ p => {
          this.router.navigate(['/']);
        },
            /* error path */ e => { this.setAlert('danger', 'het inloggen is niet gelukt: ' + e); this.processing = false; },
            /* onComplete */() => this.processing = false
      );
    return false;
  }
}
