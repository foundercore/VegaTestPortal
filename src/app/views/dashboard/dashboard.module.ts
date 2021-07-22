import { CommonComponentModule } from './../common-component/common-component.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AssignmentTestComponent } from './assignment-test/assignment-test.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { TestPendingVerificationComponent } from './test-pending-verification/test-pending-verification.component';
import { DashboardComponent } from './dashboard.component';
import { VegaMaterialModule } from 'src/app/core/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../layout/layout.module';
import { Role } from 'src/app/core/constants';
import { RoleGuard } from 'src/app/guard/role.guard';
import { StudentReportComponent } from '../common-component/view-student-assignment-result/student-report.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'assignment_report/:id',
    component: StudentReportComponent,
    canActivate: [RoleGuard],
    data: {
      roles: [Role.ADMIN, Role.STAFF, Role.STUDENT],
      breadcrumb: 'Assignment Report'
    },
    runGuardsAndResolvers: 'always',
  },
];

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AssignmentTestComponent,
    StudentDashboardComponent,
    TestPendingVerificationComponent,
    DashboardComponent
  ],
  imports: [
    LayoutModule,
    CommonModule,
    VegaMaterialModule,
    SharedModule,
    RouterModule.forChild(routes),
    CommonComponentModule
  ],
  exports: [RouterModule]
})
export class DashboardModule { }
