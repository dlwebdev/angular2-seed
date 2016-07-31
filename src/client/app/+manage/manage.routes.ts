import { RouterConfig } from '@angular/router';

import { ManagePollComponent } from './index';

export const ManageRoutes: RouterConfig = [
  {
    path: 'manage',
    component: ManagePollComponent
  },
  {
    path: 'manage/:id',
    component: ManagePollComponent
  },    
];
