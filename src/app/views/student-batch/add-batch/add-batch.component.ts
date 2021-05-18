import { StudentBatchModel } from './../../../models/student-batch/student-batch-model';
import { StudentBatchService } from './../../../services/student-batch/student-batch.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { IUserCreateRequestModel, IUserUpdateRequestModel } from 'src/app/models/user/user-model';
import { UserService } from 'src/app/services/users/users.service';
import { AddUserDialogComponent } from '../../user/add-user-dialog/add-user-dialog.component';

@Component({
  selector: 'app-add-batch',
  templateUrl: './add-batch.component.html',
  styleUrls: ['./add-batch.component.scss']
})
export class AddBatchComponent implements OnInit {

  batchFormGroup = new FormGroup({
    name: new FormControl('',[Validators.required]),
    description: new FormControl('',[Validators.required])
  })

  constructor(
    private studentBatchService: StudentBatchService,
    private tosterService: ToastrService,
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit(): void {

  }


  createBatch(){
    if (this.batchFormGroup.invalid) {
      return;
    }
    const studentBatchObj: StudentBatchModel = {
      name: this.batchFormGroup.controls['name'].value,
      description:this.batchFormGroup.controls['description'].value
    }
    this.studentBatchService.createStudentBatch(studentBatchObj).subscribe(resp => {
      this.tosterService.success('Batch is created successfully');
      this.dialogRef.close();
    },error => {
      this.tosterService.error(error.error.apierror.message);
    });
  }


  reset(){
    this.batchFormGroup.reset();
  }

}
