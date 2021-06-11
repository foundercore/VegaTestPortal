import { AssignmentRequest } from './../../../models/test-assignment/test-assignment-request';
import { Component, OnInit, ChangeDetectionStrategy, Inject, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { TestAssignmentServiceService } from 'src/app/services/assignment/test-assignment-service.service';
import { UserService } from 'src/app/services/users/users.service';
import { AddUserDialogComponent } from '../../user/add-user-dialog/add-user-dialog.component';
import { StudentBatchService } from 'src/app/services/student-batch/student-batch.service';
import { StudentBatchModel } from 'src/app/models/student-batch/student-batch-model';
import { IUserResponseModel } from 'src/app/models/user/user-model';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-assignment-form',
  templateUrl: './assignment-form.component.html',
  styleUrls: ['./assignment-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentFormComponent implements  OnInit,AfterViewInit {
  batchList: StudentBatchModel[] = [];
  studentList: IUserResponseModel[] = [];
  locale = 'en-US';

  assignmentFormGroup ;

  constructor(
    private userService: UserService,
    private tosterService: ToastrService,
    public translate: TranslateService,
    public dialogRef: MatDialogRef<AssignmentFormComponent>,
    private studentBatchService: StudentBatchService,
    private testAssignmentService: TestAssignmentServiceService,
     @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.studentBatchService.getStudentBatchList().subscribe(data => this.batchList = data);
    this.userService.getUserList().subscribe(data => {
      this.studentList = data.filter((x) => x.roles.includes('ROLE_STUDENT'));
    });

  }
  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    if (this.data.data) {
      // this.assignmentFormGroup.controls.passcode.setValue(this.data.data.passcode);
      // this.assignmentFormGroup.controls.description.setValue(this.data.data.description);
      // this.assignmentFormGroup.controls.releaseDate.setValue(this.data.data.releaseDate);
      // this.assignmentFormGroup.controls.validFrom.setValue(this.data.data.validFrom);
      // this.assignmentFormGroup.controls.validTo.setValue(this.data.data.validTo);
      // this.assignmentFormGroup.controls.assignedToBatch.patchValue(this.data.data.assignedToBatch);
      // this.assignmentFormGroup.controls.assignedToStudent.patchValue(this.data.data.assignedToStudent);

      this.assignmentFormGroup = new FormGroup(
        {
          passcode: new FormControl(this.data.data.passcode, [Validators.required]),
          description: new FormControl(this.data.data.description, [Validators.required]),
          releaseDate: new FormControl(this.data.data.releaseDate, [Validators.required]),
          validFrom: new FormControl(this.data.data.validFrom, [Validators.required]),
          validTo: new FormControl(this.data.data.validTo, [Validators.required]),
          assignedToBatch: new FormControl(this.data.data.assignedToBatch, [Validators.required]),
          assignedToStudent: new FormControl(this.data.data.assignedToStudent, [Validators.required]),
        }
      );
    } else {
      this.assignmentFormGroup = new FormGroup(
        {
          passcode: new FormControl('', [Validators.required]),
          description: new FormControl('', [Validators.required]),
          releaseDate: new FormControl('', [Validators.required]),
          validFrom: new FormControl('', [Validators.required]),
          validTo: new FormControl('', [Validators.required]),
          assignedToBatch: new FormControl([], [Validators.required]),
          assignedToStudent: new FormControl([], [Validators.required]),
        }
      );
    }

  }

  add() {
    if (this.assignmentFormGroup.invalid) {
      return;
    }

    const assignmentObj : AssignmentRequest = {
      description : this.assignmentFormGroup.controls.description.value,
      passcode: this.assignmentFormGroup.controls.passcode.value,
      releaseDate: formatDate(this.assignmentFormGroup.controls.releaseDate.value, 'yyyy-MM-dd hh:mm:ss', this.locale),
      testId: this.data.testId,
      validFrom: formatDate(this.assignmentFormGroup.controls.validFrom.value, 'yyyy-MM-dd hh:mm:ss', this.locale),
      validTo: formatDate(this.assignmentFormGroup.controls.validTo.value, 'yyyy-MM-dd hh:mm:ss', this.locale),
      assignedToBatch:this.assignmentFormGroup.controls.assignedToBatch.value,
      assignedToStudent:this.assignmentFormGroup.controls.assignedToStudent.value,
    }

    this.testAssignmentService.addAssignment(assignmentObj).subscribe(
      (resp) => {
        this.tosterService.success('Assignment is created successfully');
        this.dialogRef.close();
      },
      (error) => {
        this.tosterService.error(error.error.apierror.message);
      }
    );
  }

  edit() {
    if (this.assignmentFormGroup.invalid ) {
      return;
    }
    const assignmentObj : AssignmentRequest = {
      description : this.assignmentFormGroup.controls.description.value,
      passcode: this.assignmentFormGroup.controls.passcode.value,
      releaseDate: formatDate(this.assignmentFormGroup.controls.releaseDate.value, 'yyyy-MM-dd hh:mm:ss', this.locale),
      testId: this.data.testId,
      validFrom: formatDate(this.assignmentFormGroup.controls.validFrom.value, 'yyyy-MM-dd hh:mm:ss', this.locale),
      validTo: formatDate(this.assignmentFormGroup.controls.validTo.value, 'yyyy-MM-dd hh:mm:ss', this.locale),
      assignedToBatch:this.assignmentFormGroup.controls.assignedToBatch.value,
      assignedToStudent:this.assignmentFormGroup.controls.assignedToStudent.value,
    }
    this.testAssignmentService.updateAssignment(this.data.data.assignmentId, assignmentObj).subscribe(
      (resp) => {
        this.tosterService.success('Assignment is updated successfully');
        this.dialogRef.close();
      },
      (error) => {
        this.tosterService.error(error.error.apierror.message);
      }
    );
  }

  reset() {
    this.assignmentFormGroup.reset();
  }

}
