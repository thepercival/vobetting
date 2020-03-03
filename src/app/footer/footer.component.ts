import { Component, OnInit } from '@angular/core';

import { GlobalEventsManager } from '../common/eventmanager';
import { NavBarLiveboardLink } from '../nav/nav.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  liveboardLink: NavBarLiveboardLink = {};

  constructor(private globalEventsManager: GlobalEventsManager) {
    this.globalEventsManager.toggleLiveboardIconInNavBar.subscribe((liveboardLink: NavBarLiveboardLink) => {
      this.liveboardLink = liveboardLink;
    });
  }

  ngOnInit() {
  }

}
