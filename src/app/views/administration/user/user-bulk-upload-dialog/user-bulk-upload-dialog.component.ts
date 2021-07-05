import { UserService } from 'src/app/services/users/users.service';
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
import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, last, map, tap } from 'rxjs/operators';
import { FileUploadModel } from 'src/app/models/file/file-upload-model';
import { BaseService } from 'src/app/services/base.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-bulk-upload-dialog',
  templateUrl: './user-bulk-upload-dialog.component.html',
  styleUrls: ['./user-bulk-upload-dialog.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 100 })),
      transition('* => void', [animate(300, style({ opacity: 0 }))]),
    ]),
  ],
})
export class UserBulkUploadDialogComponent extends BaseService {
  public file: FileUploadModel | undefined;
  public fileName = 'Choose file';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    public translate: TranslateService,
    private dialogRef: MatDialogRef<UserBulkUploadDialogComponent>,
    private userService: UserService
  ) {
    super();
  }

  @ViewChild('fileInput') input: any;

  ngOnInit(): void {}

  downloadTemplate() {
    let link = document.createElement('a');
    link.download = 'user_bulk_upload_sample.csv';
    link.href = 'assets/templates/user_bulk_upload_sample.csv';
    link.click();
  }

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

  uploadTemplate() {
    this.file!.inProgress = true;
    this.file!.sub = this.userService.bulkCreateUser(this.file)
      .pipe(
        map((event: any) => {
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
          const { data } = this.file!;
          this.file = undefined;
          this.input.nativeElement.value = null;
          return of(`${data.name} upload failed.`);
        })
      )
      .subscribe((event: any) => {
        if (typeof event === 'object') {
          this.toastr.success(`${this.file!.data.name} upload successfully.`);
          this.file = undefined;
          this.dialogRef.close();
        }
      });
  }
}
