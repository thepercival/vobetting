import { Component } from '@angular/core';

import { MyNavigation } from './common/navigation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'vobetting';

  constructor(
    protected myNavigation: MyNavigation
  ) {
  }
}
