import { StudentBatchModel } from './../../../models/student-batch/student-batch-model';
import { StudentBatchService } from './../../../services/student-batch/student-batch.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { IUserCreateRequestModel, IUserUpdateRequestModel } from 'src/app/models/user/user-model';
import { UserService } from 'src/app/services/users/users.service';
import { AddUserDialogComponent } from '../../user/add-user-dialog/add-user-dialog.component';
import { TranslateService } from '@ngx-translate/core';

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
    public translate: TranslateService,
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit(): void {
      if(this.data){
            this.batchFormGroup.controls.name.setValue(this.data.name);
            this.batchFormGroup.controls.name.disable();
            this.batchFormGroup.controls.description.setValue(this.data.description);
            this.batchFormGroup.controls.description.disable();
      }
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
      if(error.error.apierror.subErrors){
        this.tosterService.error(error.error.apierror.subErrors[0].field + " " + error.error.apierror.subErrors[0].message);
      }else {
        this.tosterService.error(error.error.apierror.message);
      }
    });
  }


  reset(){
    this.batchFormGroup.reset();
  }

}
