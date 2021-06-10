import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { TestConfigurationVM } from '../../models/test-configuration';
import { TestConfigService } from '../../services/test-config-service';

@Component({
  selector: 'app-test-config',
  templateUrl: './test-config.component.html',
  styleUrls: ['./test-config.component.css']
 
})
export class TestconfigComponent implements OnInit {
config = new TestConfigurationVM();


  constructor( @Inject(MAT_DIALOG_DATA) public _data: any,public dialogRef: MatDialogRef<TestconfigComponent>,
  public dialog: MatDialog,private testConfigService : TestConfigService,private toastrService : ToastrService) { }

  ngOnInit(): void {
   if(this._data?.controlParms != null && this._data?.controlParms != undefined){
    this.config = this._data?.controlParms;
   }
  }

  SubmitConfiguration(){
    debugger;
    if(this._data?.testId != null){
      this.config.testId = this._data?.testId;
      this.testConfigService
      .TestConfiguration(this.config)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(
        (res: any) => {
         this.toastrService.success("Test configured successfully");
        },
        (error) => {
          debugger;
          this.toastrService.error(error?.error?.message ? error?.error?.message : error?.message, 'Error');
        }
      )
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


}

