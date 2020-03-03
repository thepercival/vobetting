import { EventEmitter, Injectable } from '@angular/core';

import { NavBarLiveboardLink } from '../nav/nav.component';

@Injectable()
export class GlobalEventsManager {
    public toggleLiveboardIconInNavBar: EventEmitter<NavBarLiveboardLink> = new EventEmitter();
}
