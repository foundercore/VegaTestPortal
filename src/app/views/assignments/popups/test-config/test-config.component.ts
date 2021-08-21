import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, last, map, tap } from 'rxjs/operators';
import { FileUploadModel } from 'src/app/models/file/file-upload-model';
import { TestConfigurationVM } from '../../models/test-configuration';
import { TestConfigService } from '../../services/test-config-service';

@Component({
  selector: 'app-test-config',
  templateUrl: './test-config.component.html',
  styleUrls: ['./test-config.component.css']

})
export class TestconfigComponent implements OnInit {

  config = new TestConfigurationVM();

  public fileName = 'Choose file';

  public file: FileUploadModel | undefined;

  public configurationFormControl = new FormGroup({
      doNotShowReport: new FormControl(false),
      allowCalculator: new FormControl(false),
      percentile: new FormControl(true),
      shuffleQuestions: new FormControl(false),
      sectionalTest: new FormControl(false),
    }
  )

  constructor(
    @Inject(MAT_DIALOG_DATA) public _data: any,
    public dialogRef: MatDialogRef<TestconfigComponent>,
    public dialog: MatDialog,
    private testConfigService : TestConfigService,
    private toastrService : ToastrService)

  { }

  ngOnInit(): void {
   if(this._data?.controlParms != null && this._data?.controlParms != undefined){
    this.config = this._data?.controlParms;
    this.configurationFormControl.setValue({
      doNotShowReport:this._data?.controlParms.doNotShowReport,
      allowCalculator:this._data?.controlParms.allowCalculator,
      percentile:this._data?.controlParms.percentile,
      shuffleQuestions:this._data?.controlParms.shuffleQuestions,
      sectionalTest:this._data?.controlParms.shuffleQuestions.sectionalTest
    })
   }
  }

  saveConfiguration(){

    if(this._data?.testId != null){
    forkJoin([
      this.testConfigService.saveTestConfiguration({
        doNotShowReport:this.configurationFormControl.controls.doNotShowReport.value,
        allowCalculator:this.configurationFormControl?.controls.allowCalculator.value,
        percentile:this.configurationFormControl?.controls.percentile.value,
        shuffleQuestions:this.configurationFormControl?.controls.shuffleQuestions.value,
        sectionalTest: this.configurationFormControl?.controls.sectionalTest.value
      },this._data?.testId),
      this.testConfigService .savePercentileFile(this.file,this._data?.testId)

    ]).subscribe((results) => {
      this.dialogRef.close();
      this.toastrService.success("Test configured successfully");
    }, (error) => {
      this.toastrService.error(error?.error?.message ? error?.error?.message : error?.message, 'Error');
    });
  }
  }

  getQuestionPaperbyId() {
    this.testConfigService
      .getQuestionPaper(this._data?.testId)
      .pipe(finalize(() => {}))
      .subscribe(
        (res: any) => {
          this.config = res.controlParam;
          this.toastrService.success("Reset successfully");
          console.log('this.gettest==', res);
          // }
        },
        (error) => {
          this.toastrService.error(
            error?.error?.message ? error?.error?.message : error?.message,
            'Error'
          );
        }
      );
  }

  close(){
    this.dialogRef.close();
  }


  onFileChange(event: any) {
    if (event.target.files.length !== 0) {
      this.file = {
        data: event.target.files[0],
        state: 'in',
        inProgress: false,
        progress: 0,
        canRetry: false,
        canCancel: true,
      };
      this.fileName = event.target.files[0].name;
    } else {
      this.fileName = 'Choose file';
      this.file = undefined;
    }
  }
}

