import { NgModule } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown'

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


import { MaterialModule } from './material.module';

import { BugDetailsComponent } from './components/pages/bug-details/bug-details.component';
import { BugSearchComponent } from './components/pages/bug-search/bug-search.component';
import { BugNewComponent } from './components/pages/bug-new/bug-new.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { IndexComponent } from './components/pages/index/index.component';
import { BugRowComponent } from './components/elements/bug-row/bug-row.component';
import { GraphQLModule } from './graphql.module';
import { LoginComponent } from './components/pages/login/login.component';
import { AuthService } from './services/auth.service';
import { LayoutComponent } from './components/elements/layout/layout.component';
import { AppsComponent } from './components/pages/apps/apps.component';
import { TagChipComponent } from './components/elements/tag-chip/tag-chip.component';
import { StatusChipComponent } from './components/elements/status-chip/status-chip.component';
import { EntryMessageComponent } from './components/elements/entry-message/entry-message.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { TagInputComponent } from './components/elements/tag-input/tag-input.component';
import { AdminComponent } from './components/pages/admin/admin.component';
import { Recaptchav2Service } from './services/recaptchav2.service';
import { RecaptchaModule } from 'ng-recaptcha';

@NgModule({
  declarations: [
    AppComponent,
    AppsComponent,
    BugDetailsComponent,
    BugNewComponent,
    BugSearchComponent,
    DashboardComponent,
    IndexComponent,
    BugRowComponent,
    LoginComponent,
    LayoutComponent,
    TagChipComponent,
    StatusChipComponent,
    EntryMessageComponent,
    DateAgoPipe,
    TagInputComponent,
    AdminComponent,
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
    GraphQLModule,
    MarkdownModule.forRoot(),
    CommonModule,
    RecaptchaModule
  ],
  providers: [
    AuthService,
    Recaptchav2Service
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
