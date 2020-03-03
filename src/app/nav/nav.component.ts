import { Component, Input, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { GlobalEventsManager } from '../common/eventmanager';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  @Input()
  title: string;
  navbarCollapsed = true;
  liveboardLink: NavBarLiveboardLink = {};

  constructor(
    private authService: AuthService,
    private globalEventsManager: GlobalEventsManager
  ) {
    this.globalEventsManager.toggleLiveboardIconInNavBar.subscribe((tournamentLiveboardLink: NavBarLiveboardLink) => {
      this.liveboardLink = tournamentLiveboardLink;
    });
  }

  ngOnInit() {
  }

  isLoggedIn() {

    return this.authService.isLoggedIn();
  }

}

export class NavBarLiveboardLink {
  showIcon?: boolean;
  tournamentId?: number;
  link?: string;
}
