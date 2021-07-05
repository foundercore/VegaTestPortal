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

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
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
  ],
  exports: [RouterModule]
})
export class DashboardModule { }
