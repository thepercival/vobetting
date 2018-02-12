import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-struct';

import { IAlert } from '../app.definitions';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  modelFilter: any;
  alert: IAlert;
  isCollapsed = true;
  loading = false;
  minEndDate: NgbDateStruct;
  maxEndDate: NgbDateStruct;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.type !== undefined && params.message !== undefined) {
        this.alert = { type: params['type'], message: params['message'] };
      }
    });
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
}
