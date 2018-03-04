import { Component, Input, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  @Input()
  title: string;
  navbarCollapsed = true;
  // showCompetitionDetails: boolean = false;

  constructor(
    private authService: AuthService/*
      ,
      private globalEventsManager: GlobalEventsManager*/
  ) {
    // this.globalEventsManager.showLeagueeasonDetailsInNavBar.subscribe((mode)=>{
    //   this.showLeagueeasonDetails = mode;
    //   console.log('in navbar show is ' + mode );
    // });
  }

  ngOnInit() {
  }

  isLoggedIn() {

    return this.authService.isLoggedIn();
  }

}
