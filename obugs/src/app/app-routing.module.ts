import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BugDetailsComponent } from './components/pages/bug-details/bug-details.component';
import { BugNewComponent } from './components/pages/bug-new/bug-new.component';
import { BugSearchComponent } from "./components/pages/bug-search/bug-search.component";
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { IndexComponent } from './components/pages/index/index.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 's/:software/bug/add', component: BugNewComponent },
  { path: 's/:software/bug/search', component: BugSearchComponent },
  { path: 's/:software/bug/:bug', component: BugDetailsComponent },
  { path: 's/:software', component: DashboardComponent },
  { path: '**', component: IndexComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
