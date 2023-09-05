import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { ReactiveFormsModule } from '@angular/forms';


import { MaterialModule } from './material.module';

import { BugDetailsComponent } from './components/pages/bug-details/bug-details.component';
import { BugSearchComponent } from './components/pages/bug-search/bug-search.component';
import { BugNewComponent } from './components/pages/bug-new/bug-new.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { IndexComponent } from './components/pages/index/index.component';
import { HeaderComponent } from './components/elements/header/header.component';
import { SoftwareSidenavComponent } from './components/elements/software-sidenav/software-sidenav.component';
import { BugRowComponent } from './components/elements/bug-row/bug-row.component';

@NgModule({
  declarations: [
    AppComponent,
    BugDetailsComponent,
    BugNewComponent,
    BugSearchComponent,
    DashboardComponent,
    IndexComponent,
    HeaderComponent,
    SoftwareSidenavComponent,
    BugRowComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpClientXsrfModule,
    LayoutModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
