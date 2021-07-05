import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { StudentBatchModel } from 'src/app/models/student-batch/student-batch-model';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { StudentBatchService } from 'src/app/services/student-batch/student-batch.service';
import { AddUserDialogComponent } from '../../user/add-user-dialog/add-user-dialog.component';

@Component({
  selector: 'app-bulk-upload-batch-students',
  templateUrl: './bulk-upload-batch-students.component.html',
  styleUrls: ['./bulk-upload-batch-students.component.scss'],
})
export class BulkUploadBatchStudentsComponent implements OnInit {
  batchList = [];
  emailPattern = '^(s?[^s,]+@[^s,]+.[^s,]+s?,)*(s?[^s,]+@[^s,]+.[^s,]+)$';

  batchFormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    listOfStudent: new FormControl('', [Validators.required]),
  });

  constructor(
    private studentBatchService: StudentBatchService,
    private tosterService: ToastrService,
    public translate: TranslateService,
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    public authorizationService: AuthorizationService
  ) {
    this.studentBatchService.getStudentBatchList().subscribe(
      (data) => {
        data.forEach(
          (x) => (x.student_count = x.students !== null ? x.students.length : 0)
        );
        this.batchList = data;
      },
      (err) => {}
    );
  }

  ngOnInit(): void {}

  upload() {
    if (this.batchFormGroup.invalid) {
      return;
    }
    if (!this.authorizationService.isAdmin) {
      this.tosterService.error('Role missing permissions');
      return;
    }

    this.studentBatchService
      .addStudentInBatch(
        this.batchFormGroup.controls['name'].value.id.batchId,
        this.batchFormGroup.controls['listOfStudent'].value.split(',')
      )
      .subscribe(
        (resp) => {
          this.tosterService.success('Student is tagged successfully');
          this.batchFormGroup.controls.name.reset();
          this.batchFormGroup.controls.listOfStudent.reset();
        },
        (error) => {
          this.tosterService.error(error.error.apierror.debugMessage);
        }
      );
  }
}
