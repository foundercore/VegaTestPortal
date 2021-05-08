import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './core/app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { VegaMaterialModule } from './core/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NavbarComponent } from './views/navbar/navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ReportsComponent } from './views/reports/reports.component';
import { AdminComponent } from './views/admin/admin.component';
import { AuthGuard } from './guard/auth.guard';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderComponent } from './shared/components/header/header.component';
import { UploadQuestionsComponent } from './views/questions/upload-questions/upload-questions.component';
import { RegisterComponent } from './views/register/register.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AuthEffects } from './state_management/_effects/auth.effects';
import { AppReducer } from './state_management/_reducers/auth.reducers';
import { LoggedInAuthGuard } from './guard/loggedin.guard';
import { QuestionManagementComponent } from './views/questions/question-management/question-management.component';
import { TokenInterceptor } from './core/token-interceptor';
import { QuestionBulkUploadDialogComponent } from './views/questions/question-bulk-upload-dialog/question-bulk-upload-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    DashboardComponent,
    ReportsComponent,
    AdminComponent,
    HeaderComponent,
    UploadQuestionsComponent,
    RegisterComponent,
    QuestionManagementComponent,
    QuestionBulkUploadDialogComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    VegaMaterialModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    StoreModule.forRoot(AppReducer, {}),
    EffectsModule.forRoot([AuthEffects]),
    ToastrModule.forRoot(),
  ],
  providers: [AuthGuard,LoggedInAuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
