import { RouterConfig } from '@angular/router';

import { PollsComponent } from './index';
import { PollDetailComponent } from './index';

export const PollsRoutes: RouterConfig = [
  {
    path: 'polls',
    component: PollsComponent
  },
  {
    path: 'poll-detail/:id',
    component: PollDetailComponent
  },  
];
