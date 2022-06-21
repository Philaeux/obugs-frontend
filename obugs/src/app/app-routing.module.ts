import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/pages/index/index.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { BugDetailsComponent } from './components/pages/bug-details/bug-details.component';
import { LoginComponent } from "./components/pages/login/login.component";
import { BugSearchComponent } from "./components/pages/bug-search/bug-search.component";
import {AccountComponent} from "./components/pages/account/account.component";
import {AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo} from "@angular/fire/auth-guard";

const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'index', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'account', component: AccountComponent },
  { path: 's/:software-list/dashboard', component: DashboardComponent },
  { path: 's/:software-list/bug/:id', component: BugDetailsComponent },
  { path: 's/:software-list/bug/search', component: BugSearchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
