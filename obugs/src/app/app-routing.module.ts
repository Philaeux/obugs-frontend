import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { SoftwareComponent } from './components/software/software.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BugDetailsComponent } from './components/bug-details/bug-details.component';
import { LoginComponent } from "./components/login/login.component";
import { SearchComponent } from "./components/search/search.component";

const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'index', component: IndexComponent },
  { path: 'software', component: SoftwareComponent },
  { path: 'login', component: LoginComponent },
  { path: ':software/dashboard', component: DashboardComponent },
  { path: ':software/bug/:id', component: BugDetailsComponent },
  { path: ':software/search', component: SearchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
