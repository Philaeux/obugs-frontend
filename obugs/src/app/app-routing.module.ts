import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { SoftwaresComponent } from './softwares/softwares.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BugDetailsComponent } from './bug-details/bug-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'index', component: IndexComponent },
  { path: 'softwares', component: SoftwaresComponent },
  { path: ':software/dashboard', component: DashboardComponent },
  { path: ':software/bug/:id', component: BugDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
