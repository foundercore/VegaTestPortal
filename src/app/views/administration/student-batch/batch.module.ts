import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddBatchStudentComponent } from './add-batch-student/add-batch-student.component';
import { AddBatchComponent } from './add-batch/add-batch.component';
import { BulkUploadBatchStudentsComponent } from './bulk-upload-batch-students/bulk-upload-batch-students.component';
import { StudentBatchManagementComponent } from './student-batch-management/student-batch-management.component';
import { RouterModule } from '@angular/router';
import { VegaMaterialModule } from 'src/app/core/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: StudentBatchManagementComponent,
  },

];

@NgModule({
  declarations: [
    AddBatchComponent,
    AddBatchStudentComponent,
    BulkUploadBatchStudentsComponent,
    StudentBatchManagementComponent,
  ],
  imports: [
    CommonModule,
    VegaMaterialModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class BatchModule { }
