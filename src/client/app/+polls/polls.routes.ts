import { RouterConfig } from '@angular/router';

import { PollsComponent } from './index';
import { PollDetailComponent } from './index';
//import { ManagePollComponent } from './index';

export const PollsRoutes: RouterConfig = [
  {
    path: 'polls',
    component: PollsComponent
  },
  {
    path: 'poll-detail/:id',
    component: PollDetailComponent
  },  
  //{
  //  path: 'manage-poll/:id',
  //  component: ManagePollComponent
  //},   
];
