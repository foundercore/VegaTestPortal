import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-assessment-editor',
  templateUrl: './assessment-editor.component.html',
  styleUrls: ['./assessment-editor.component.css'],
})
export class AssessmentEditorComponent implements OnInit {
  public testForm: FormGroup;
  isInputzero: boolean = false;
  descriptionFilled: boolean = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public _data: any,
    public dialogRef: MatDialogRef<AssessmentEditorComponent>,
    public dialog: MatDialog
  ) {}
  descriptionEditorconfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '10rem',
    maxHeight: '10rem',
    placeholder: 'Enter Instruction here...',
    translate: 'no',
    sanitize: false,
    enableToolbar: true,
    showToolbar: true,
    toolbarPosition: 'top',
    defaultFontName: 'Arial',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };
  ngOnInit(): void {
    this.testForm = new FormGroup({
      testName: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.testForm.controls[controlName].hasError(errorName);
  };

  submit() {
    if (this.testForm.invalid) {
      return;
    } else {
      this.dialogRef.close(this.testForm.value);
    }
  }

  Reset() {
    this.testForm.reset();
  }

  close() {
    this.dialogRef.close();
  }

  checkdurationInput() {
    if (this.testForm.value.duration <= 0) {
      this.isInputzero = true;
    } else if (this.testForm.value.duration == '') {
      this.isInputzero = false;
    } else {
      this.isInputzero = false;
    }
  }
}
