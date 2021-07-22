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
import { StudentReportComponent } from '../views/common-component/view-student-assignment-result/student-report.component';

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
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
        data: {
          breadcrumb: 'Dashboard'
        },
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../views/dashboard/dashboard.module').then(  (m) => m.DashboardModule ),
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'questionmanagement',
        loadChildren: () => import('../views/questions/questions.module').then(  (m) => m.QuestionsModule ),
        data: {
          breadcrumb: 'Question Management'
        },
      },
      {
        path: 'reports',
        loadChildren: () => import('../views/reports/reports.module').then(  (m) => m.ReportsModule ),
        runGuardsAndResolvers: 'always',
        data: {
          breadcrumb: 'Reports'
        },
      },
      {
        path: 'tests',
        canActivate: [RoleGuard],
        data: {
          roles: [Role.ADMIN, Role.STAFF],
          breadcrumb: 'Test'
        },
        loadChildren: () =>
          import('../views/assignments/assignments.module').then(
            (m) => m.AssignmentsModule
          ),
      },
      {
        path: 'administrations',
        canActivate: [RoleGuard],
        data: {
          roles: [Role.ADMIN],
          breadcrumb: 'Administrations'
        },
        children: [
          {
            path: 'users',
            loadChildren: () => import('../views/administration/user/user.module').then(  (m) => m.UserModule ),
            data: {
              breadcrumb: 'Users'
            }
          },
          {
            path: 'batch',
            loadChildren: () => import('../views/administration/student-batch/batch.module').then(  (m) => m.BatchModule ),
            data: {
              breadcrumb: 'Batch'
            }
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
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
