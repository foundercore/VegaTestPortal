import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { UserBulkUploadDialogComponent } from './user-bulk-upload-dialog/user-bulk-upload-dialog.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { Routes, RouterModule } from '@angular/router';
import { Role } from 'src/app/core/constants';
import { RoleGuard } from 'src/app/guard/role.guard';
import { StudentBatchManagementComponent } from '../student-batch/student-batch-management/student-batch-management.component';
import { VegaMaterialModule } from 'src/app/core/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.STAFF] },
  },
];

@NgModule({
  declarations: [
    AddUserDialogComponent,
    UserBulkUploadDialogComponent,
    UserManagementComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    VegaMaterialModule,
    SharedModule
  ],
  exports: [RouterModule]
})
export class UserModule { }
