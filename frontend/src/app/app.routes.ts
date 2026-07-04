import { Routes } from '@angular/router';
import { StateListComponent } from './components/state-list/state-list.component';
import { StateDetailComponent } from './components/state-detail/state-detail.component';

export const routes: Routes = [
  { path: '', component: StateListComponent },
  { path: 'states/:id', component: StateDetailComponent },
  { path: '**', redirectTo: '' }
];
