import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../views/layout/home/home.component';
import { LoginComponent } from '../views/bootstrap/login/login.component';
import { DashboardComponent } from '../views/dashboard/dashboard.component';
import { ReportsComponent } from '../views/reports/reports.component';
import { AuthGuard } from '../guard/auth.guard';
import { RegisterComponent } from '../views/bootstrap/register/register.component';
import { LoggedInAuthGuard } from '../guard/loggedin.guard';
import { RoleGuard } from '../guard/role.guard';
import { Role } from './constants';
import { StudentReportComponent } from '../views/reports/student-report/student-report.component';

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
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('../views/dashboard/dashboard.module').then(  (m) => m.DashboardModule ),
      },
      {
        path: 'questionmanagement',
        loadChildren: () => import('../views/questions/questions.module').then(  (m) => m.QuestionsModule ),
      },
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.ADMIN, Role.STAFF] },
      },
      {
        path: 'assignment_report/:id',
        component: StudentReportComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.ADMIN, Role.STAFF, Role.STUDENT] },
      },
      {
        path: 'tests',
        canActivate: [RoleGuard],
        data: { roles: [Role.ADMIN, Role.STAFF] },
        loadChildren: () =>
          import('../views/assignments/assignments.module').then(
            (m) => m.AssignmentsModule
          ),
      },
      {
        path: 'administrations',
        children: [
          {
            path: 'users',
            loadChildren: () => import('../views/administration/user/user.module').then(  (m) => m.UserModule ),
          },
          {
            path: 'batch',
            loadChildren: () => import('../views/administration/student-batch/batch.module').then(  (m) => m.BatchModule ),
          }
        ]
       },
    ],
    canActivate: [AuthGuard],
  },
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
