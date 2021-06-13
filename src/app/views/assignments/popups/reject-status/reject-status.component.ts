import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-reject-status',
  templateUrl: './reject-status.component.html',
  styleUrls: ['./reject-status.component.css']
  
})
export class RejectstatusComponent implements OnInit {
  public rejectForm: FormGroup;
  isInputzero : boolean = false;
  constructor( @Inject(MAT_DIALOG_DATA) public _data: any,public dialogRef: MatDialogRef<RejectstatusComponent>,
  public dialog: MatDialog) { }
  ngOnInit(): void {
    this.rejectForm = new FormGroup({
      reason: new FormControl('', [Validators.required])
    });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.rejectForm.controls[controlName].hasError(errorName);
  }


  submit(){
    if(this.rejectForm.invalid){
      return ;
    }
    else{
      this.dialogRef.close(this.rejectForm.value);
    }
  }

  Reset(){
    this.rejectForm.reset();
  }


  close(){
    this.dialogRef.close();
  }








}

