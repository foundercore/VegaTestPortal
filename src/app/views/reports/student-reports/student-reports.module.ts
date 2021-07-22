import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentReportsComponent } from './student-reports.component';
import { Routes, RouterModule } from '@angular/router';
import { VegaMaterialModule } from 'src/app/core/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonComponentModule } from 'src/app/views/common-component/common-component.module';
import { StudentListGridComponent } from './student-list-grid/student-list-grid.component';

const routes: Routes = [
  {
    path: '',
    component: StudentReportsComponent,
    children:[
      {
        path: 'selected-student/:student_id',
        component: StudentListGridComponent
      }
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
