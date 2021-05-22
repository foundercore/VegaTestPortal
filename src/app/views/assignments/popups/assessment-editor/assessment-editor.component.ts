import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-assessment-editor',
  templateUrl: './assessment-editor.component.html',
  styleUrls: ['./assessment-editor.component.css']
  
})
export class AssessmentEditorComponent implements OnInit {
  public testForm: FormGroup;

  constructor( @Inject(MAT_DIALOG_DATA) public _data: any,public dialogRef: MatDialogRef<AssessmentEditorComponent>,
  public dialog: MatDialog) { }

  ngOnInit(): void {
    this.testForm = new FormGroup({
      testName: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required])
    });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.testForm.controls[controlName].hasError(errorName);
  }


  submit(){
    if(this.testForm.invalid){
      return ;
    }
    else{
      this.dialogRef.close(this.testForm.value);
    }
  }

  Reset(){
    this.testForm.reset();
  }


  close(){
    this.dialogRef.close();
  }




}

