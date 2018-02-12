import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { SportConfig } from 'ngx-sport';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

SportConfig.apiurl = environment.apiurl;

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
