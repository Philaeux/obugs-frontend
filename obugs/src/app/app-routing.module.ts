import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from "./components/pages/account/account.component";
import { BugDetailsComponent } from './components/pages/bug-details/bug-details.component';
import { BugNewComponent } from './components/pages/bug-new/bug-new.component';
import { BugSearchComponent } from "./components/pages/bug-search/bug-search.component";
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { IndexComponent } from './components/pages/index/index.component';
import { LoginComponent } from "./components/pages/login/login.component";

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'account', component: AccountComponent },
  { path: 'login', component: LoginComponent },
  { path: 's/:software/bug/new', component: BugNewComponent },
  { path: 's/:software/bug/search', component: BugSearchComponent },
  { path: 's/:software/bug/:id', component: BugDetailsComponent },
  { path: 's/:software', component: DashboardComponent },
  { path: '**', component: IndexComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
