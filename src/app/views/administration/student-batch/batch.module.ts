import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddBatchStudentComponent } from './add-batch-student/add-batch-student.component';
import { AddBatchComponent } from './add-batch/add-batch.component';
import { BulkUploadBatchStudentsComponent } from './bulk-upload-batch-students/bulk-upload-batch-students.component';
import { StudentBatchManagementComponent } from './student-batch-management/student-batch-management.component';
import { RouterModule, Routes } from '@angular/router';
import { Role } from 'src/app/core/constants';
import { RoleGuard } from 'src/app/guard/role.guard';
import { UserManagementComponent } from '../user/user-management/user-management.component';
import { VegaMaterialModule } from 'src/app/core/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: StudentBatchManagementComponent,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.STAFF] },
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
    RouterModule.forChild(routes),
    VegaMaterialModule,
    SharedModule
  ],
  exports: [RouterModule]
})
export class BatchModule { }
