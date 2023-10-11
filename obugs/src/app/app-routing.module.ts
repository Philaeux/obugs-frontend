import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BugDetailsComponent } from './components/pages/bug-details/bug-details.component';
import { BugNewComponent } from './components/pages/bug-new/bug-new.component';
import { BugSearchComponent } from "./components/pages/bug-search/bug-search.component";
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { IndexComponent } from './components/pages/index/index.component';
import { LoginComponent } from './components/pages/login/login.component';
import { AppsComponent } from './components/pages/apps/apps.component';
import { AdminComponent } from './components/pages/admin/admin.component';
import { AppsNewComponent } from './components/pages/apps-new/apps-new.component';

const routes: Routes = [
  { path: '', title: 'oBugs - Community-driven bug tracker', component: IndexComponent },
  { path: 'apps', title: 'oBugs - Applications', component: AppsComponent },
  { path: 'apps/new', title: 'oBugs - Suggest a new Software', component: AppsNewComponent },
  { path: 'login', title: 'oBugs - Login', component: LoginComponent },
  { path: 'admin', title: 'oBugs - Admin', component: AdminComponent },
  { path: 's/:software/new', component: BugNewComponent },
  { path: 's/:software/bug/search', component: BugSearchComponent },
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
