import { filter } from 'rxjs/operators';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TestAssignmentServiceService } from 'src/app/services/assignment/test-assignment-service.service';
import { SearchQuestionPaperVM } from '../../assignments/models/searchQuestionPaperVM';
import { TestConfigService } from '../../assignments/services/test-config-service';

@Component({
  selector: 'app-test-analysis',
  templateUrl: './test-analysis.component.html',
  styleUrls: ['./test-analysis.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestAnalysisComponent implements OnInit {

  selectedTest;
  testList: any[] = [];
  filteredTestList: any[] = [];

  show = true;

  constructor(
    public translate: TranslateService,
    public dialog: MatDialog,
    private router: Router,
    private testService: TestConfigService,
    private testAssignmentService: TestAssignmentServiceService,
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
    this.testAssignmentService.getMyAssignment().subscribe(
      (resp) => {
        this.testList = resp.filter(x => x.attempted);
        this.filteredTestList = resp.filter(x => x.attempted);
      });
  }

  selectTest(data) {
    if (data.value) {
      this.selectedTest = data.value;
      this.router
        .navigate([
          '/home/reports/test_analysis/selected-test/' + data.value.testId,
          data.value.testName,data.value.assignmentId
        ])
        .then(() =>
          console.log(
            'Navigate to Test Report Selected Test - ' +
              data.value.assignmentId
          )
        )
        .catch((err) =>
          console.log(
            'Error=> Navigate to Test Report Selected Test - ' +
              data.value.assignmentId,
            err
          )
        );
    } else {
      this.selectedTest = null;
      this.router
        .navigate(['/home/reports/test_analysis'])
        .then(() => console.log('Navigate to Test Analysis'))
        .catch((err) =>
          console.log('Error => Navigate to Test Analysis =>', err)
        );
    }
  }

  search(event) {
    let filter = event.target.value.toLowerCase();
    if(filter){
      this.filteredTestList = this.testList.filter(x => x.testName.toLowerCase().includes(filter));
    } else {
      this.filteredTestList = this.testList;
    }

  }

  ngDoCheck() {
    this.ref.markForCheck();
  }
}
