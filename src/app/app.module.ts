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
import { HttpClientModule } from '@angular/common/http';
import { LoggedInAuthGuard } from './guard/loggedin.guard';
import { HeaderComponent } from './shared/components/header/header.component';

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
    ToastrModule.forRoot(),
  ],
  providers: [AuthGuard, LoggedInAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
