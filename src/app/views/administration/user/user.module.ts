import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { UserBulkUploadDialogComponent } from './user-bulk-upload-dialog/user-bulk-upload-dialog.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { RouterModule } from '@angular/router';
import { VegaMaterialModule } from 'src/app/core/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    AddUserDialogComponent,
    UserBulkUploadDialogComponent,
    UserManagementComponent,

  ],
  imports: [
    CommonModule,
    VegaMaterialModule,
    SharedModule
  ],
  exports: [RouterModule]
})
export class UserModule { }
