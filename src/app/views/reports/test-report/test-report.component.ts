import { TestConfigService } from './../../assignments/services/test-config-service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SearchQuestionPaperVM } from '../../assignments/models/searchQuestionPaperVM';

@Component({
  selector: 'app-test-report',
  templateUrl: './test-report.component.html',
  styleUrls: ['./test-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestReportComponent implements OnInit {

  selectedTest;
  testList: any[] = [];
  filteredTestList: any[] = [];
  testListCopy: any[] = [];

  show = true;

  constructor(
    public translate: TranslateService,
    public dialog: MatDialog,
    private router: Router,
    private testService: TestConfigService,
    public _router: Router,
    private ref: ChangeDetectorRef
  ) {
    router.events.subscribe((val) => {
      // see also
      if (val instanceof NavigationEnd) {
        if (val.url.includes('assignment_report')) {
          this.show = false;
        } else {
          this.show = true;
        }
        ref.detectChanges();
      }
    });
  }

  ngOnInit(): void {
    const testSearchObj: SearchQuestionPaperVM = new SearchQuestionPaperVM ("1",100);
    testSearchObj.status = "PUBLISHED"

    this.testService.getAllQuestionPaper(testSearchObj).subscribe((data) => {
      this.filteredTestList = data.tests;
    });

  }

  selectTest(data) {
    if (data.value) {
      this.selectedTest = data.value;
      this.router
        .navigate([
          '/home/reports/test/selected-test/' + data.value.questionPaperId,
          data.value.name,
        ])
        .then(() =>
          console.log(
            'Navigate to Test Report Selected Test - ' +
              data.value.questionPaperId
          )
        )
        .catch((err) =>
          console.log(
            'Error=> Navigate to Test Report Selected Test - ' +
              data.value.questionPaperId,
            err
          )
        );
    } else {
      this.selectedTest = null;
      this.router
        .navigate(['/home/reports/test'])
        .then(() => console.log('Navigate to Test Report'))
        .catch((err) =>
          console.log('Error => Navigate to Test Report =>', err)
        );
    }
  }

  search(event) {
    let filter = event.target.value.toLowerCase();
    const testSearchObj: SearchQuestionPaperVM = new SearchQuestionPaperVM ("1",100);
    testSearchObj.status = "PUBLISHED"
    if(filter){
      testSearchObj.nameRegexPattern = filter;
    }
    this.testService.getAllQuestionPaper(testSearchObj).subscribe((data) => {
      this.filteredTestList = data.tests;
    });
  }

  ngDoCheck() {
    this.ref.markForCheck();
  }

}
