import { GroupVerticalBarChartComponent } from './views/charts/group-vertical-bar-chart/group-vertical-bar-chart.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//import { ChartsModule, ChartSimpleModule, WavesModule } from 'ng-uikit-pro-standard'

import {​​​​​ MDBBootstrapModule }​​​​​ from 'angular-bootstrap-md';

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
import { RoleGuard } from './guard/role.guard';
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
import { AngularEditorModule } from '@kolkov/angular-editor';
import { QuestionFormComponent } from './views/questions/question-form/question-form.component';
import { UserManagementComponent } from './views/user/user-management/user-management.component';
import { UserBulkUploadDialogComponent } from './views/user/user-bulk-upload-dialog/user-bulk-upload-dialog.component';
import { AddUserDialogComponent } from './views/user/add-user-dialog/add-user-dialog.component';
import {ProfileComponent } from 'src/app/views/user/profile/profile.component';
import { AdminDashboardComponent } from './views/dashboard/admin-dashboard/admin-dashboard.component';
import { StudentDashboardComponent } from './views/dashboard/student-dashboard/student-dashboard.component';
import { ChangePasswordComponent } from './views/user/change-password/change-password.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { reducers } from './state_management/_states/auth.state';
import { QuestionFormPreviewComponent } from './views/questions/question-form-preview/question-form-preview.component';
import { StudentBatchManagementComponent } from './views/student-batch/student-batch-management/student-batch-management.component';
import { AddBatchComponent } from './views/student-batch/add-batch/add-batch.component';
import { AddBatchStudentComponent } from './views/student-batch/add-batch-student/add-batch-student.component';
import { StudentReportComponent } from './views/reports/student-report/student-report.component';
import { VerticalBarChartComponent } from './views/charts/vertical-bar-chart/vertical-bar-chart.component';
import { PieChartComponent } from './views/charts/pie-chart/pie-chart.component';
import { SingleLayerGaugeComponent } from './views/charts/single-layer-gauge/single-layer-gauge.component';
import { BulkUploadBatchStudentsComponent } from './views/student-batch/bulk-upload-batch-students/bulk-upload-batch-students.component';
// import ngx-translate and the http loader
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient} from '@angular/common/http';
import { QuestionMigrateUploadDialogComponent } from './views/questions/question-migrate-upload-dialog/question-migrate-upload-dialog.component';
import { DialogConformationComponent } from './shared/components/dialog-conformation/dialog-conformation.component';
import { AssignmentFormComponent } from './views/assignments/assignment-form/assignment-form.component';
import { ViewAssignmentComponent } from './views/assignments/view-assignment/view-assignment.component';
import { CountdownModule } from 'ngx-countdown';
import { AddStudentsComponent } from './views/assignments/add-students/add-students.component';
import { CustomDialogConfirmationComponent } from './shared/components/custom-dialog-confirmation/custom-dialog-confirmation.component';
import { TestPendingVerificationComponent } from './views/dashboard/test-pending-verification/test-pending-verification.component';
import { AssignmentTestComponent } from './views/dashboard/assignment-test/assignment-test.component';
import { TermConditionPageComponent } from './views/dashboard/term-condition-page/term-condition-page.component';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

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
    UserManagementComponent,
    QuestionFormComponent,
    UserBulkUploadDialogComponent,
    AddUserDialogComponent,
    ProfileComponent,
    AdminDashboardComponent,
    StudentDashboardComponent,
    ChangePasswordComponent,
    QuestionFormPreviewComponent,
    StudentBatchManagementComponent,
    AddBatchComponent,
    AddBatchStudentComponent,
    StudentReportComponent,
    VerticalBarChartComponent,
    GroupVerticalBarChartComponent,
    PieChartComponent,
    SingleLayerGaugeComponent,
    BulkUploadBatchStudentsComponent,
    QuestionMigrateUploadDialogComponent,
    DialogConformationComponent,
    ViewAssignmentComponent,
    AssignmentFormComponent,
    AddStudentsComponent,
    CustomDialogConfirmationComponent,
    TestPendingVerificationComponent,
    AssignmentTestComponent,
    TermConditionPageComponent
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
    AngularEditorModule,
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
      }
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
    TranslateService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
