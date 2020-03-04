import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-struct';

import { IAlert } from '../common/alert';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  alert: IAlert;
  processing = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.type !== undefined && params.message !== undefined) {
        this.alert = { type: params.type, message: params.message };
      }
    });

    if (this.authService.isLoggedIn() === false) {
      this.router.navigate(['/user/login']);
      return;
    }

    this.authService.validateToken().subscribe(
        /* happy path */ res => { },
        /* error path */ e => {
        this.authService.logout();
        this.router.navigate(['/user/login']);
      },
        /* onComplete */() => { this.processing = false; }
    );
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  protected setAlert(type: string, message: string) {
    this.alert = { type, message };
  }
}
