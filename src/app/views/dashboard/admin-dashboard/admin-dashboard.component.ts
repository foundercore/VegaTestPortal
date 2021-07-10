import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TestAssignmentServiceService } from 'src/app/services/assignment/test-assignment-service.service';
import { StudentBatchService } from 'src/app/services/student-batch/student-batch.service';
import { UserService } from 'src/app/services/users/users.service';
import { SearchQuestionPaperVM } from '../../assignments/models/searchQuestionPaperVM';
import { TestConfigService } from '../../assignments/services/test-config-service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  _testsAssignedToMe = [];
  numberOfUsers: number;
  numberOfBatches: number;
  numberOfTests: number;
  allTests = [];
  draftTests = [];
  pendingVerificationTest = [];
  verifiedTests = [];
  testsAssignedToMe = [];
  myTestCount = 0;
  verifiedTestCount = 0;
  searchEvent: any;
  draftTestCount = 0;
  pendingVerificationTestCount = 0;
  constructor(
    public translate: TranslateService,
    public testService: TestConfigService,
    public userService: UserService,
    public batchService: StudentBatchService,
    public testAssignmentService: TestAssignmentServiceService,
    private ref: ChangeDetectorRef
  ) {}
  ngOnInit(): void {}
  ngAfterViewInit(): void {
    Promise.all([
      this.userService
        .getUserList()
        .toPromise()
        .then((data) => data.length),
      this.batchService
        .getStudentBatchList()
        .toPromise()
        .then((data) => data.length),
      this.testService
        .getAllQuestionPaper(new SearchQuestionPaperVM('1'))
        .toPromise(),
      this.testAssignmentService.getMyAssignment().toPromise(),
    ])
      .then((data) => {
        this._testsAssignedToMe = data[3];
        this.testsAssignedToMe = data[3];
        this.numberOfUsers = data[0];
        this.numberOfBatches = data[1];
        this.allTests = data[2].tests || [];
        this.numberOfTests = this.allTests.length;
        this.draftTests = this.allTests.filter((t) => t.status == 'DRAFT');
        this.pendingVerificationTest = this.allTests.filter(
          (t) => t.status == 'PENDING_VERIFICATION'
        );
        this.verifiedTests = this.allTests.filter(
          (t) => t.status == 'PUBLISHED'
        );
        this.myTestCount = this.testsAssignedToMe.length;
        this.draftTestCount = this.draftTests.length;
        this.verifiedTestCount = this.verifiedTests.length;
        this.pendingVerificationTestCount = this.pendingVerificationTest.length;
        this.ref.markForCheck();
      })
      .catch(console.error);
  }
  applyFilter(e: Event) {
    clearTimeout(this.searchEvent);
    this.searchEvent = setTimeout(() => {
      let searchPattern = (e.target as HTMLInputElement).value;
      this.testsAssignedToMe = this._testsAssignedToMe.filter((t) =>
        t.testName.includes(searchPattern)
      );
      this.draftTests = this.allTests.filter(
        (t) => t.status == 'DRAFT' && t.name.includes(searchPattern)
      );
      this.pendingVerificationTest = this.allTests.filter(
        (t) =>
          t.status == 'PENDING_VERIFICATION' && t.name.includes(searchPattern)
      );
      this.verifiedTests = this.allTests.filter(
        (t) => t.status == 'PUBLISHED' && t.name.includes(searchPattern)
      );
      this.myTestCount = this.testsAssignedToMe.length;
      this.draftTestCount = this.draftTests.length;
      this.verifiedTestCount = this.verifiedTests.length;
      this.pendingVerificationTestCount = this.pendingVerificationTest.length;
      this.ref.markForCheck();
    }, 500);
  }
}
