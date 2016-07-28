import { provideRouter, RouterConfig } from '@angular/router';

import { AboutRoutes } from './+about/index';
import { HomeRoutes } from './+home/index';
import { PollsRoutes } from './+polls/index';
import { LoginRoutes } from './+login/index';

const routes: RouterConfig = [
  ...HomeRoutes,
  ...AboutRoutes,
  ...PollsRoutes,
  ...LoginRoutes
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes),
];
