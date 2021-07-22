import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentReportsComponent } from './student-reports.component';
import { Routes, RouterModule } from '@angular/router';
import { VegaMaterialModule } from 'src/app/core/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonComponentModule } from 'src/app/views/common-component/common-component.module';
import { StudentListGridComponent } from './student-list-grid/student-list-grid.component';
import { StudentReportComponent } from '../../common-component/view-student-assignment-result/student-report.component';
import { Role } from 'src/app/core/constants';
import { RoleGuard } from 'src/app/guard/role.guard';
import { StudentReportBreadcrumbResolverService } from './student-report-breadcrumb-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: StudentReportsComponent,
    children:[
      {
        path: 'selected-student/:student_id/:student_name',
        component: StudentListGridComponent,
        runGuardsAndResolvers: 'always',
        resolve: {breadcrumb: StudentReportBreadcrumbResolverService},
        children: [
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
        ]
      },

    ]
  },
];

@NgModule({
  declarations: [
    StudentReportsComponent,
    StudentListGridComponent
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
export class StudentReportsModule { }
