import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi, withXsrfConfiguration } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { MarkdownModule, MARKED_OPTIONS } from 'ngx-markdown'
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { GraphQLModule } from './graphql.module';
import { MaterialModule } from './material.module';

import { AdminComponent } from './components/pages/admin/admin.component';
import { ApiService } from './services/api.service';
import { AppComponent } from './app.component';
import { AppManageComponent } from './components/pages/app-manage/app-manage.component';
import { AppsComponent } from './components/pages/apps/apps.component';
import { AppsNewComponent } from './components/pages/apps-new/apps-new.component';
import { AuthService } from './services/auth.service';
import { BugDetailsComponent } from './components/pages/bug-details/bug-details.component';
import { BugNewComponent } from './components/pages/bug-new/bug-new.component';
import { BugRowComponent } from './components/elements/bug-row/bug-row.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { EntryMessageComponent } from './components/elements/entry-message/entry-message.component';
import { IndexComponent } from './components/pages/index/index.component';
import { LoginComponent } from './components/pages/login/login.component';
import { StatusChipComponent } from './components/elements/status-chip/status-chip.component';
import { TagChipComponent } from './components/elements/tag-chip/tag-chip.component';
import { TagInputComponent } from './components/elements/tag-input/tag-input.component';
import { UsernameComponent } from './components/elements/username/username.component';

@NgModule({ declarations: [
        AdminComponent,
        AppComponent,
        AppManageComponent,
        AppsComponent,
        AppsNewComponent,
        BugDetailsComponent,
        BugNewComponent,
        BugRowComponent,
        DashboardComponent,
        DateAgoPipe,
        EntryMessageComponent,
        IndexComponent,
        LoginComponent,
        StatusChipComponent,
        TagChipComponent,
        TagInputComponent,
        UsernameComponent,
    ],
    bootstrap: [AppComponent], imports: [AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        GraphQLModule,
        LayoutModule,
        MarkdownModule.forRoot({
            markedOptions: {
                provide: MARKED_OPTIONS,
                useValue: {
                    gfm: true,
                    breaks: true,
                    pedantic: false
                }
            }
        }),
        MaterialModule,
        ReactiveFormsModule], providers: [
        ApiService,
        AuthService,
        Title,
        provideHttpClient(withInterceptorsFromDi(), withXsrfConfiguration()),
    ] })
export class AppModule {
}
