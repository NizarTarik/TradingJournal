import { Routes } from '@angular/router';

import { MainLayout } from './layout/main-layout/main-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { JournalListComponent } from './pages/Journal/journal-list/journal-list';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        component: Dashboard,
      },
      {
        path: 'journal',
        component: JournalListComponent,
      },
    ],
  },
];
