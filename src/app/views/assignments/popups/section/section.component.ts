import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionComponent implements OnInit {
  public sectionForm: FormGroup;

  constructor( @Inject(MAT_DIALOG_DATA) public _data: any,public dialogRef: MatDialogRef<SectionComponent>,
  public dialog: MatDialog) { }

  ngOnInit(): void {
    this.sectionForm = new FormGroup({
      sectionName: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required])
    });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.sectionForm.controls[controlName].hasError(errorName);
  }


  AddSection(){
    if(this.sectionForm.invalid){
      return ;
    }
    else{
      this.dialogRef.close(this.sectionForm.value);
    }
  }

  Reset(){
    this.sectionForm.reset();
  }


  close(){
    this.dialogRef.close();
  }




}
