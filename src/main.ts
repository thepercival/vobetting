import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { SportConfig } from 'ngx-sport';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

SportConfig.apiurl = environment.apiurl;
SportConfig.useExternal = true;

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
