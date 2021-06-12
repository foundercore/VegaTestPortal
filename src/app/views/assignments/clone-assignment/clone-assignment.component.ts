import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-clone-assignment',
  templateUrl: './clone-assignment.component.html',
  styleUrls: ['./clone-assignment.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CloneAssignmentComponent implements OnInit {
  public cloneForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<CloneAssignmentComponent>) { }

  ngOnInit(): void {
    this.cloneForm = new FormGroup({
      testName: new FormControl('', [Validators.required])
    });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.cloneForm.controls[controlName].hasError(errorName);
  }
  clone() {
    if (this.cloneForm.invalid) {
      return;
    }
    else {
      this.dialogRef.close(this.cloneForm.value);
    }
  }
}
