import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestReportComponent } from './test-report.component';
import { Routes, RouterModule } from '@angular/router';
import { VegaMaterialModule } from 'src/app/core/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonComponentModule } from '../../common-component/common-component.module';
import { TestStudentTableComponent } from './test-student-table/test-student-table.component';
import { RoleGuard } from 'src/app/guard/role.guard';
import { Role } from 'src/app/core/constants';
import { TestReportBreadcrumbResolverService } from './test-report-breadcrumb-resolver.service';


const routes: Routes = [
  {
    path: '',
    component: TestReportComponent,
    children:[
      {
        path: 'selected-test/:test_id/:test_name',
        component: TestStudentTableComponent,
        runGuardsAndResolvers: 'always',
        resolve: {breadcrumb: TestReportBreadcrumbResolverService},
        children: [
          {
            path: 'assignment_report/:id',
            //component: 'StudentReportComponent',
            canActivate: [RoleGuard],
            data: {
              roles: [Role.ADMIN, Role.STAFF, Role.STUDENT],
              breadcrumb: 'Assignment Report'
            },
            runGuardsAndResolvers: 'always',
          },
        ]
      },

    ]
  },
];


@NgModule({
  declarations: [
    TestReportComponent,
    TestStudentTableComponent
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
export class TestReportModule { }
