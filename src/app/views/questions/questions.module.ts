import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionBulkUploadDialogComponent } from './question-bulk-upload-dialog/question-bulk-upload-dialog.component';
import { QuestionFormPreviewComponent } from './question-form-preview/question-form-preview.component';
import { QuestionFormComponent } from './question-form/question-form.component';
import { QuestionManagementComponent } from './question-management/question-management.component';
import { QuestionMigrateUploadDialogComponent } from './question-migrate-upload-dialog/question-migrate-upload-dialog.component';
import { UploadQuestionsComponent } from './upload-questions/upload-questions.component';
import { RouterModule, Routes } from '@angular/router';
import { Role } from 'src/app/core/constants';
import { RoleGuard } from 'src/app/guard/role.guard';
import { VegaMaterialModule } from 'src/app/core/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { VideoPreviewComponent } from './video-preview/video-preview.component';
import { EmbedVideo } from 'ngx-embed-video';

const routes: Routes = [
  {
    path: '',
    component: QuestionManagementComponent,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.STAFF] },
  },
  {
    path: ':id/edit',
    component: QuestionFormComponent,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.STAFF], breadcrumb: 'Edit Question' },
  },
  {
    path: ':id/view',
    component: QuestionFormPreviewComponent,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.STAFF], breadcrumb: 'View Question' },
  },
  {
    path: 'add',
    component: QuestionFormComponent,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.STAFF], breadcrumb: 'Add Question' },
  },
];

@NgModule({
  declarations: [
    QuestionBulkUploadDialogComponent,
    QuestionFormComponent,
    QuestionFormPreviewComponent,
    QuestionManagementComponent,
    QuestionMigrateUploadDialogComponent,
    UploadQuestionsComponent,
    VideoPreviewComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    VegaMaterialModule,
    SharedModule,
    EmbedVideo.forRoot()
  ],
  exports: [RouterModule],
})
export class QuestionsModule {}
