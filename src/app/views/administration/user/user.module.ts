import { ViewStudentBatchDialogComponent } from './view-student-batch-dialog/view-student-batch-dialog.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { UserBulkUploadDialogComponent } from './user-bulk-upload-dialog/user-bulk-upload-dialog.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { RouterModule, Routes } from '@angular/router';
import { VegaMaterialModule } from 'src/app/core/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
  },

];

@NgModule({
  declarations: [
    AddUserDialogComponent,
    UserBulkUploadDialogComponent,
    UserManagementComponent,
    ViewStudentBatchDialogComponent
  ],
  imports: [
    CommonModule,
    VegaMaterialModule,
    SharedModule,
    RouterModule.forChild(routes),

  ],
  exports: [RouterModule]
})
export class UserModule { }
