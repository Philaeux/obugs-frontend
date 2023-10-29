import { NgModule } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown'

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MaterialModule } from './material.module';
import { GraphQLModule } from './graphql.module';
import { RecaptchaModule } from 'ng-recaptcha';

import { AdminComponent } from './components/pages/admin/admin.component';
import { AppsComponent } from './components/pages/apps/apps.component';
import { AppsNewComponent } from './components/pages/apps-new/apps-new.component';
import { BugDetailsComponent } from './components/pages/bug-details/bug-details.component';
import { BugNewComponent } from './components/pages/bug-new/bug-new.component';
import { BugRowComponent } from './components/elements/bug-row/bug-row.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { EntryMessageComponent } from './components/elements/entry-message/entry-message.component';
import { IndexComponent } from './components/pages/index/index.component';
import { LoginComponent } from './components/pages/login/login.component';
import { StatusChipComponent } from './components/elements/status-chip/status-chip.component';
import { TagChipComponent } from './components/elements/tag-chip/tag-chip.component';
import { TagInputComponent } from './components/elements/tag-input/tag-input.component';
import { UsernameComponent } from './components/elements/username/username.component';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { Recaptchav2Service } from './services/recaptchav2.service';
import { DateAgoPipe } from './pipes/date-ago.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AppsComponent,
    AppsNewComponent,
    BugDetailsComponent,
    BugNewComponent,
    DashboardComponent,
    IndexComponent,
    BugRowComponent,
    LoginComponent,
    TagChipComponent,
    StatusChipComponent,
    EntryMessageComponent,
    DateAgoPipe,
    TagInputComponent,
    AdminComponent,
    UsernameComponent
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
    Recaptchav2Service,
    Title,
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
