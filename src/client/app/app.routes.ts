import { provideRouter, RouterConfig } from '@angular/router';

import { AboutRoutes } from './+about/index';
import { HomeRoutes } from './+home/index';
import { PollsRoutes } from './+polls/index';
import { LoginRoutes } from './+login/index';
import { ManageRoutes } from './+manage/index';

const routes: RouterConfig = [
  ...HomeRoutes,
  ...AboutRoutes,
  ...PollsRoutes,
  ...LoginRoutes,
  ...ManageRoutes
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes),
];
