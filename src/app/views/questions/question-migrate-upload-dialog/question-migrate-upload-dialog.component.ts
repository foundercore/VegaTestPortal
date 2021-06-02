import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { map, tap, last, catchError } from 'rxjs/operators';
import { FileUploadModel } from 'src/app/models/file/file-upload-model';
import { QuestionManagementService } from 'src/app/services/question-management/question-management.service';
import { QuestionBulkUploadDialogComponent } from '../question-bulk-upload-dialog/question-bulk-upload-dialog.component';

@Component({
  selector: 'app-question-migrate-upload-dialog',
  templateUrl: './question-migrate-upload-dialog.component.html',
  styleUrls: ['./question-migrate-upload-dialog.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 100 })),
      transition('* => void', [animate(300, style({ opacity: 0 }))]),
    ]),
  ],
})
export class QuestionMigrateUploadDialogComponent {

  public file: FileUploadModel | undefined;

  public fileName = 'Choose file';

  constructor(
    private questionManagementService: QuestionManagementService,
    private toastr: ToastrService,
    public translate: TranslateService,
    private dialogRef: MatDialogRef<QuestionBulkUploadDialogComponent>
  ) {

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

  downloadConvertedJson(data,file) {
     let link = document.createElement('a');
     link.download = file!.data.name + 'output.csv';
    var blob = new Blob([data], { type: 'text/csv' });
    link.href =  window.URL.createObjectURL(blob);
    link.click();
  }

  uploadTemplate() {

    this.file!.inProgress = true;
    this.file!.sub = this.questionManagementService.migrateQuestion(this.file).pipe(
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
          this.fileName = 'Choose file';
          console.log(event.headers.get('content-disposition'));
          this.downloadConvertedJson(event.body,this.file);
          this.file = undefined;
          this.dialogRef.close();
        }
      });
  }
}
