import { StudentBatchManagementComponent } from './../views/student-batch/student-batch-management/student-batch-management.component';
import { QuestionFormPreviewComponent } from './../views/questions/question-form-preview/question-form-preview.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../views/home/home.component';
import { LoginComponent } from '../views/login/login.component';
import { DashboardComponent } from '../views/dashboard/dashboard.component';
import { ReportsComponent } from '../views/reports/reports.component';
import { AuthGuard } from '../guard/auth.guard';
import { RegisterComponent } from '../views/register/register.component';
import { LoggedInAuthGuard } from '../guard/loggedin.guard';
import { QuestionManagementComponent } from '../views/questions/question-management/question-management.component';
import { QuestionFormComponent } from '../views/questions/question-form/question-form.component';
import { UserManagementComponent } from '../views/user/user-management/user-management.component';
import { RoleGuard } from '../guard/role.guard';
import { Role } from './constants';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoggedInAuthGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,

      },
      {
        path: 'questionmanagement',
        children:[
          {
            path: '',
            component: QuestionManagementComponent,
            canActivate: [RoleGuard],
            data: { roles: [Role.ADMIN, Role.STAFF] }
          },
          {
            path: ':id/edit',
            component: QuestionFormComponent,
            canActivate: [RoleGuard],
            data: { roles: [Role.ADMIN, Role.STAFF] }
          },
          {
            path: ':id/view',
            component: QuestionFormPreviewComponent,
            canActivate: [RoleGuard],
            data: { roles: [Role.ADMIN, Role.STAFF] }
          },
          {
            path: 'add',
            component: QuestionFormComponent,
            canActivate: [RoleGuard],
            data: { roles: [Role.ADMIN, Role.STAFF] }
          }
        ],
       },
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.ADMIN, Role.STAFF] }
      },
      {
        path: 'tests',
        component: DashboardComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.ADMIN, Role.STAFF] }
      },
      {
        path: 'users',
        component: UserManagementComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.ADMIN, Role.STAFF] }
      },
      {
        path: 'batch',
        component: StudentBatchManagementComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.ADMIN, Role.STAFF] }
      },
    ],
    canActivate: [AuthGuard],
  },
  { path: 'assignments', loadChildren: () => import('../views/assignments/assignments.module').then(m => m.AssignmentsModule)},
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
