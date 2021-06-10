import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { SearchQuestionPaperVM } from '../../models/searchQuestionVM';
import { TestConfigService } from '../../services/test-config-service';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css'],
})
export class SectionComponent implements OnInit {
  public sectionForm: FormGroup;
  isInputzero : boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public _data: any,
    public dialogRef: MatDialogRef<SectionComponent>,
    public dialog: MatDialog,
    private testConfigService: TestConfigService,
    public toastrService: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.sectionForm = new FormGroup({
      sectionName: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
    });
    this.getQuestionPaperbyId();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.sectionForm.controls[controlName].hasError(errorName);
  };

  AddSection() {
    if (this.sectionForm.invalid) {
      return;
    } else {
      this.dialogRef.close(this.sectionForm.value);
    }
  }

  AddSectionWithDurationCheck() {
    let model = new SearchQuestionPaperVM();
    this.testConfigService
      .getAllQuestionPaper(model)
      .pipe(finalize(() => {}))
      .subscribe(
        (res: any) => {
          //if (res.isSuccess) {

          console.log('this.listtest ==', res);
          if (res.tests !== null) {
            res.tests?.map((test) => {
              //check for currentt section in all tests data with current test
              if (test.questionPaperId === this._data.testId) {
                console.log(' test=>', test);
                var maxDuration = test.totalDurationInMinutes;
                var totDuration = 0;
                console.log('MaxDuration for this test=>', maxDuration);
                if (test.sections !== null) {
                  test.sections.map((section) => {
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
                  this.AddSection();
                } else {
                  this.toastrService.error(
                    'You exceeded the maximum duration limit. Please choose durations for each section such that the total will be less or equal to Total duration of test.'
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
        }
      );
    this.getQuestionPaperbyId();
    // if (this.sectionForm.invalid) {
    //   return;
    // } else {
    //   this.dialogRef.close(this.sectionForm.value);
    // }
  }
  getQuestionPaperbyId() {
    // // if (this.route.snapshot.paramMap.get('id') != null) {
    // this.testConfigService
    //   .getQuestionPaper(this.route.snapshot.paramMap.get('id'))
    //   .subscribe((res: any) => {
    //     // this.controlparms = res?.controlParam;
    //     // this.modelsections = res?.sections;
    //     console.log('this.gettest==', res);
    //   });
    // //}
    console.log('this._data=>', this._data);
  }

  GetAllquestionPapers() {
    let model = new SearchQuestionPaperVM();
    this.testConfigService
      .getAllQuestionPaper(model)
      .pipe(finalize(() => {}))
      .subscribe(
        (res: any) => {
          //if (res.isSuccess) {

          console.log('this.listtest==', res);
        },
        (error) => {
          this.toastrService.error(
            error?.error?.message ? error?.error?.message : error?.message,
            'Error'
          );
        }
      );
  }

  Reset() {
    this.sectionForm.reset();
  }

  close() {
    this.dialogRef.close();
  }

  checkdurationInput(){
    if(this.sectionForm.value.duration <= 0){
      this.isInputzero = true;
    }
    else if(this.sectionForm.value.duration == ""){
      this.isInputzero = false;
    }
    else{
      this.isInputzero = false;
    }
  }
}
