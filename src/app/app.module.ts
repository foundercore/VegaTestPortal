import { BootstrapModule } from './views/bootstrap/bootstrap.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AppRoutingModule } from './core/app-routing.module';
import { AppComponent } from './app.component';
import { VegaMaterialModule } from './core/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthGuard } from './guard/auth.guard';
import { RoleGuard } from './guard/role.guard';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AuthEffects } from './state_management/_effects/auth.effects';
import { LoggedInAuthGuard } from './guard/loggedin.guard';
import { TokenInterceptor } from './core/token-interceptor';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { reducers } from './state_management/_states/auth.state';
// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { CountdownModule } from 'ngx-countdown';
import { TermConditionPageComponent } from './views/term-condition-page/term-condition-page.component';
import { ReportsModule } from './views/reports/reports.module';
import { BreadcrumbNavService } from './views/layout/breadcrumb/breadcrumb-nav.service';
import { TestManagementModule } from './views/test-management/test-management.module';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    TermConditionPageComponent,

  ],

  imports: [
    //User Module
    BootstrapModule,
    TestManagementModule,
    //System Module
    HttpClientModule,
    FontAwesomeModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    VegaMaterialModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    StoreModule.forRoot(reducers, {}),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot([AuthEffects]),
    ToastrModule.forRoot(),
    MDBBootstrapModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate : false
    }),
    CountdownModule
  ],
  providers: [
    AuthGuard,
    RoleGuard,
    LoggedInAuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    TranslateService,
    BreadcrumbNavService

  ],
  exports: [TranslateModule],
  bootstrap: [AppComponent],
})
export class AppModule { }
