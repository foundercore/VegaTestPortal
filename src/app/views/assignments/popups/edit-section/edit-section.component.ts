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
import { id } from '@swimlane/ngx-charts';
import { ToastrService } from 'ngx-toastr';
import { finalize, max } from 'rxjs/operators';
import { AppState } from 'src/app/state_management/_states/auth.state';
import Swal from 'sweetalert2';
import { QuestionMarkedForReviewModel } from '../../models/questionMarkedForReview';
import { TestConfigService } from '../../services/test-config-service';
import { CalculatorComponent } from '../calculator/calculator.component';
import { TestLiveComponent } from '../test-live/test-live.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SearchQuestionPaperVM } from '../../models/searchQuestionVM';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-edit-section',
  templateUrl: './edit-section.component.html',
  styleUrls: ['./edit-section.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditSectionComponent implements OnInit {
  sectionName: '';
  sectionDuration: 0;
  sectionInstructions: '';
  sectionDifficultyLevel: '';
  showSpinner: boolean = false;
  public sectionForm: FormGroup;
  descriptionEditorconfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '5rem',
    maxHeight: '5rem',
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
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ]
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public editSection_data: any,
    public dialogRef: MatDialogRef<EditSectionComponent>,
    public dialog: MatDialog,
    private testConfigService: TestConfigService,
    private toastrService: ToastrService,
    private store: Store<AppState>,
    private router: Router
  ) {}

  hasError = (controlName: string, errorName: string) => {
    return this.sectionForm.controls[controlName].hasError(errorName);
  };

  ngOnInit(): void {
    this.sectionForm = new FormGroup({
      sectionName: new FormControl(this.editSection_data.section.name, [
        Validators.required,
      ]),
      duration: new FormControl(
        this.editSection_data.section.durationInMinutes,
        [Validators.required]
      ),
      instructions: new FormControl(this.editSection_data.section.instructions),
      difficultyLevel: new FormControl(
        this.editSection_data.section.difficultyLevel
      ),
      sectionId: new FormControl(this.editSection_data?.section.id),
    });
    console.log('editSection_data =>', this.editSection_data);
  }

  UpdateSectionWithDurationCheck() {
    console.log(
      'Update button pressed with form values =>',
      this.sectionForm.value
    );
    //this.sectionForm.getRawValue().duration
    this.Update_SectionWithDurationCheck();
  }

  Update_SectionWithDurationCheck() {
    let model = new SearchQuestionPaperVM();
    this.showSpinner = true;
    this.testConfigService
      .getAllQuestionPaper(model)
      .pipe(finalize(() => {}))
      .subscribe(
        (res: any) => {
          //if (res.isSuccess) {
          this.showSpinner = false;
          console.log('this.listtest ==', res);
          if (res.tests !== null) {
            res.tests?.map((test) => {
              //check for currentt section in all tests data with current test
              if (test.questionPaperId === this.editSection_data.testId) {
                console.log(' test=>', test);
                var maxDuration = test.totalDurationInMinutes;
                var totDuration = 0;
                console.log('MaxDuration for this test=>', maxDuration);
                if (test.sections !== null) {
                  test.sections.map((section) => {
                    if (section.id !== this.editSection_data.section.id)
                      totDuration += section.durationInMinutes;
                  });
                }
                totDuration += Number(this.sectionForm.getRawValue().duration);
                console.log(
                  'totDuration of all sections duration',
                  totDuration
                );

                if (totDuration <= maxDuration) {
                  console.log(
                    'totDuration of section < MaxDuration for current test'
                  );
                  this.UpdateSection();
                } else {
                  this.toastrService.error(
                    'You exceeded the maximum duration limit by ' +
                      (totDuration - maxDuration) +
                      ' mins.'
                  );
                }
              }
            });
          }
        },
        (error) => {
          this.toastrService.error(
            error?.error?.message ? error?.error?.message : error?.message,
            'Error'
          );
          this.showSpinner = false;
        }
      );
    // this.getQuestionPaperbyId();
    // if (this.sectionForm.invalid) {
    //   return;
    // } else {
    //   this.dialogRef.close(this.sectionForm.value);
    // }
  }

  UpdateSection() {
    if (this.sectionForm.invalid) {
      return;
    } else {
      this.dialogRef.close(this.sectionForm.value);
    }
  }

  Reset() {
    this.sectionForm.reset();
  }

  close() {
    this.dialogRef.close();
  }
}
