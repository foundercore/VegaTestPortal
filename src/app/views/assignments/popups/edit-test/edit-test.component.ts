import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { AppState } from 'src/app/state_management/_states/auth.state';
import { TestConfigService } from '../../services/test-config-service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { SearchQuestionPaperVM } from '../../models/searchQuestionPaperVM';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { EditTestMetaData } from '../../models/editTestMetaData';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-edit-test',
  templateUrl: './edit-test.component.html',
  styleUrls: ['./edit-test.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTestComponent implements OnInit {
  testName: '';
  testDuration: 0;
  testInstructions: '';
  testDifficultyLevel: '';
  showSpinner: boolean = false;
  public testForm: FormGroup;
  descriptionEditorconfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '10rem',
    maxHeight: '20rem',
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
  questionPaper = new EditTestMetaData();

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public editTest_data: any,
    public dialogRef: MatDialogRef<EditTestComponent>,
    public dialog: MatDialog,
    private testConfigService: TestConfigService,
    private toastrService: ToastrService,
    private store: Store<AppState>,
    private router: Router
  ) { }

  hasError = (controlName: string, errorName: string) => {
    return this.testForm.controls[controlName].hasError(errorName);
  };

  ngOnInit(): void {
    console.log('editTest_data =>', this.editTest_data);
    this.questionPaper = this.editTest_data.questionPaper;
    this.tags = this.editTest_data?.questionPaper?.tags || [];
    this.testForm = new FormGroup({
      testName: new FormControl(this.editTest_data.questionPaper.name, [
        Validators.required,
      ]),
      duration: new FormControl(
        this.editTest_data.questionPaper.totalDurationInMinutes,
        [Validators.required]
      ),
      totalMarks: new FormControl(this.editTest_data.questionPaper.totalMarks, []),
      tags: new FormControl(this.editTest_data.questionPaper.tags, []),
      calculatorRequired: new FormControl(this.editTest_data.questionPaper.calculatorRequired, []),
      instructions: new FormControl(
        this.editTest_data.questionPaper.instructions
      ),
      testId: new FormControl(this.editTest_data?.testId),
    });
  }

  UpdatetestWithDurationCheck() {
    console.log(
      'Update button pressed with form values =>',
      this.testForm.value
    );
    this.Updatetest();
    //this.testForm.getRawValue().duration
  }

  // Update_testWithDurationCheck() {
  //   let model = new SearchQuestionPaperVM();
  //   this.showSpinner = true;
  //   this.testConfigService
  //     .getAllQuestionPaper(model)
  //     .pipe(finalize(() => {}))
  //     .subscribe(
  //       (res: any) => {
  //         //if (res.isSuccess) {
  //         this.showSpinner = false;
  //         console.log('this.listtest ==', res);
  //         if (res.tests !== null) {
  //           res.tests?.map((test) => {
  //             //check for currentt test in all tests data with current test
  //             if (test.questionPaperId === this.editTest_data.testId) {
  //               console.log(' test=>', test);
  //               var maxDuration = test.totalDurationInMinutes;
  //               var totDuration = 0;
  //               console.log('MaxDuration for this test=>', maxDuration);
  //               if (test.tests !== null) {
  //                 test.tests.map((test) => {
  //                   if (test.id !== this.editTest_data.test.id)
  //                     totDuration += test.durationInMinutes;
  //                 });
  //               }
  //               totDuration += Number(this.testForm.getRawValue().duration);
  //               console.log('totDuration of all tests duration', totDuration);

  //               if (totDuration <= maxDuration) {
  //                 console.log(
  //                   'totDuration of test < MaxDuration for current test'
  //                 );
  //                 this.Updatetest();
  //               } else {
  //                 this.toastrService.error(
  //                   'You exceeded the maximum duration limit by ' +
  //                     (totDuration - maxDuration) +
  //                     ' mins.'
  //                 );
  //               }
  //             }
  //           });
  //         }
  //       },
  //       (error) => {
  //         this.toastrService.error(
  //           error?.error?.message ? error?.error?.message : error?.message,
  //           'Error'
  //         );
  //         this.showSpinner = false;
  //       }
  //     );
  //   // this.getQuestionPaperbyId();
  //   // if (this.testForm.invalid) {
  //   //   return;
  //   // } else {
  //   //   this.dialogRef.close(this.testForm.value);
  //   // }
  // }
  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();

    if (value || '') {
      this.tags.push(value);
    }

    // Reset the input value
    if (input) {
      event.input.value = '';
    }
  }

  removeTag(tag: string): void {
    const index = this.tags?.indexOf(tag);

    if (index != undefined && index >= 0) {
      this.tags?.splice(index, 1);
    }
  }
  Updatetest() {
    if (this.testForm.invalid) {
      return;
    } else {
      //this.dialogRef.close(this.testForm.value);
      this.UpdateTestMetaData();
    }
  }

  UpdateTestMetaData() {
    var model = this.questionPaper;
    model.name = this.testForm.value.testName;
    model.instructions = this.testForm.value.instructions;
    model.totalDurationInMinutes = this.testForm.value.duration;
    model.tags = this.tags;
    model.calculatorRequired = this.testForm.value.calculatorRequired;
    // TODO - make it summation of all the positive marks of teh section questions
    model.totalMarks = 5;
    this.testConfigService
      .updateTestMetaData(this.testForm.value.testId, model)
      .subscribe(
        (res) => {
          this.toastrService.success('Test details updated successfully');
          //this.getQuestionPaperbyId();
          this.dialogRef.close(true);
        },
        (err) => {
          this.toastrService.error('Error: ' + err.error.apierror.message);
          //this.getQuestionPaperbyId();
          //this.dialogRef.close(false);
          console.log('Error while updating test meta data=>', err);
        }
      );
  }

  Reset() {
    this.tags = [];
    this.testForm.reset();
  }

  close() {
    this.dialogRef.close();
  }
}
