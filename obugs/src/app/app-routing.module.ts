import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './components/pages/admin/admin.component';
import { AppManageComponent } from './components/pages/app-manage/app-manage.component';
import { AppsComponent } from './components/pages/apps/apps.component';
import { AppsNewComponent } from './components/pages/apps-new/apps-new.component';
import { BugDetailsComponent } from './components/pages/bug-details/bug-details.component';
import { BugNewComponent } from './components/pages/bug-new/bug-new.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { IndexComponent } from './components/pages/index/index.component';
import { LoginComponent } from './components/pages/login/login.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'apps', component: AppsComponent },
  { path: 'apps/new', component: AppsNewComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 's/:software/new', component: BugNewComponent },
  { path: 's/:software/manage', component: AppManageComponent },
  { path: 's/:software/:entry', component: BugDetailsComponent },
  { path: 's/:software', component: DashboardComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
