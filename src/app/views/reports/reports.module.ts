import { StudentReportsModule } from './student-reports/student-reports.module';
import { CommonComponentModule } from './../common-component/common-component.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { VegaMaterialModule } from 'src/app/core/material.module';
import { Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'student',
    loadChildren: () => import('./student-reports/student-reports.module').then(  (m) => m.StudentReportsModule ),
    data: {
      breadcrumb: 'Student Report'
    }
  },
  {
    path: 'test',
    loadChildren: () => import('./test-report/test-report.module').then(  (m) => m.TestReportModule ),
    data: {
      breadcrumb: 'Test Report'
    }
  },
  {
    path: 'test_analysis',
    loadChildren: () => import('./test-analysis/test-analysis.module').then(  (m) => m.TestAnalysisModule ),
    data: {
      breadcrumb: 'Test Report'
    }
  }
];



@NgModule({
  declarations: [
    ReportsComponent,
  ],
  imports: [
    CommonModule,
    VegaMaterialModule,
    SharedModule,
    RouterModule,
    CommonComponentModule,
    RouterModule.forChild(routes),
  ],
  exports:[RouterModule]
})
export class ReportsModule {}
