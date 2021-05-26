import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
  HttpRequest,
} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, last, map, tap } from 'rxjs/operators';
import { FileUploadModel } from 'src/app/models/file/file-upload-model';
import { BaseService } from 'src/app/services/base.service';
import { QuestionManagementService } from 'src/app/services/question-management/question-management.service';

@Component({
  selector: 'app-question-bulk-upload-dialog',
  templateUrl: './question-bulk-upload-dialog.component.html',
  styleUrls: ['./question-bulk-upload-dialog.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 100 })),
      transition('* => void', [animate(300, style({ opacity: 0 }))]),
    ]),
  ],
})
export class QuestionBulkUploadDialogComponent extends BaseService {
  public file: FileUploadModel | undefined;

  public fileName = 'Choose file';

  constructor(
    private questionManagementService: QuestionManagementService,
    private toastr: ToastrService,
    public translate: TranslateService,
    private dialogRef: MatDialogRef<QuestionBulkUploadDialogComponent>
  ) {
    super();
  }

  ngOnInit() {}

  onFileChange(event: any) {
    if (event.target.files.length !== 0) {
      this.file = {
        data: event.target.files[0],
        state: 'in',
        inProgress: false,
        progress: 0,
        canRetry: false,
        canCancel: true,
      };
      this.fileName = event.target.files[0].name;
    } else {
      this.fileName = 'Choose file';
      this.file  = undefined;
    }
  }

  downloadTemplate() {
    let link = document.createElement('a');
    link.download = 'question_bulk_upload_sample.csv';
    link.href = 'assets/templates/question_bulk_upload_sample.csv';
    link.click();
  }

  uploadTemplate() {

    this.file!.inProgress = true;
    this.file!.sub = this.questionManagementService.bulkUploadQuestion(this.file).pipe(
        map((event : any) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              this.file!.progress = Math.round(
                (event.loaded * 100) / event.total
              );
              break;
            case HttpEventType.Response:
              return event;
          }
        }),
        tap((message) => {}),
        last(),
        catchError((error: HttpErrorResponse) => {
          this.file!.inProgress = false;
          this.file!.canRetry = true;
          this.toastr.error(`${this.file!.data.name} upload failed.`);
          this.file = undefined;
          this.fileName = 'Choose file';
          return of(`${this.file!.data.name} upload failed.`);
        })
      )
      .subscribe((event: any) => {
        if (typeof event === 'object') {
          this.toastr.success(`${this.file!.data.name} upload successfully.`);
          this.file = undefined;
          this.fileName = 'Choose file';
          this.dialogRef.close();
        }
      });
  }
}
