import { filter } from 'rxjs/operators';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { PAGE_OPTIONS } from 'src/app/core/constants';
import { TestAssignmentServiceService } from 'src/app/services/assignment/test-assignment-service.service';
import { AppState } from 'src/app/state_management/_states/auth.state';
import Swal from 'sweetalert2';
import { TestLiveComponent } from '../../assignments/popups/test-live/test-live.component';
import { TestConfigService } from '../../assignments/services/test-config-service';
import { ToastrService } from 'ngx-toastr';
import { CustomDialogConfirmationModel } from 'src/app/shared/components/custom-dialog-confirmation/custom-dialog-confirmation-model';
import { CustomDialogConfirmationComponent } from 'src/app/shared/components/custom-dialog-confirmation/custom-dialog-confirmation.component';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class StudentDashboardComponent implements OnInit {
  resultStats = [
    {
      name: 'Passed',
      value: 60,
    },
    {
      name: 'Failed',
      value: 30,
    },
  ];

  tagSet = new Set();

  resultData: any[] = [];

  single: any[] | undefined;
  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  searchText: string = '';
  appState: any;
  userName: string = '';
  currentSectionSubmittedData: any;
  studentName: string = '';
  userType: string = '';
  buttontext: string = '';
  createdId: string = '';

  colorScheme = {
    domain: ['#52D726', '#FF0000'],
  };

  public pageOptions = PAGE_OPTIONS;

  displayedColumns: string[] = [
    'testName',
    'attempted',
    'marksObtained',
    'actions',
  ];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  totalTest: number;
  notAttempted: number;
  attempt: number;
  attempted: any[] = [];

  constructor(
    public translate: TranslateService,
    private testAssignmentService: TestAssignmentServiceService,
    public dialog: MatDialog,
    private store: Store<AppState>,
    private testConfigService: TestConfigService,
    private router: Router,
    private toastrService: ToastrService
  ) {
    this.tagSet.add('All');
  }

  ngOnInit(): void {
    this.store.select('appState').subscribe((data) => {
      this.userName = data?.user?.userName;
      this.studentName = data?.user?.firstName + ' ' + data?.user?.lastName;
      this.userType = data?.user?.authorities[0]?.authority;
      console.log('data', data);
    });
    this.getMyAssignments();
  }

  getMyAssignments() {
    this.testAssignmentService.getMyAssignment().subscribe((resp) => {
      this.resultData = resp;
      console.log('this.resultData==', this.resultData);
      this.dataSource = new MatTableDataSource<any>(this.resultData);
      this.dataSource.paginator = this.paginator;
      this.totalTest = this.resultData.length;
      this.resultData.forEach((assignment) => {
        if (assignment.attempted) this.attempted.push(assignment);
      });
      this.notAttempted = this.totalTest - this.attempted.length;
      this.attempt = this.attempted.length;
      this.resultData.forEach((assignments) => {
        if (assignments.tags != null) this.tagSet.add(assignments.tags);
      });
    });
  }

  extractContent(s) {
    var span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  }

  startTest(element) {
    if (this.userType === 'ROLE_USER_ADMIN') {
      this.buttontext = 'Preview Test';
    } else {
      console.log(element);
      const timeNow = new Date().setHours(0, 0, 0, 0);
      const testValidFrom = new Date(element.validFrom).setHours(0, 0, 0, 0);
      const testvalidTo = new Date(element.validTo).setHours(0, 0, 0, 0);
      if (timeNow < testValidFrom) {
        this.toastrService.error('Test is yet to start');
        return;
      }
      if (timeNow > testvalidTo) {
        this.toastrService.error('Test has ended already');
        return;
      }
      this.buttontext = 'Start Test';
    }

    const dialogData = new CustomDialogConfirmationModel(
      'Please read the instructions carefully before starting the test',
      element.testName,
      this.buttontext,
      'Not Now'
    );

    const dialogRef = this.dialog.open(CustomDialogConfirmationComponent, {
      width: '80vw',
      height: '80vh',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        if (
          element.passcode !== null &&
          String(element.passcode.trim()).length > 1
        ) {
          this.verifyPasscode(element);
        } else {
          this.openTestPopup(element, 'live');
        }
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openTestPopup(element, testType) {
    const dialogRef = this.dialog.open(TestLiveComponent, {
      maxWidth: '1700px',
      width: '100%',
      minHeight: '100vh',
      height: 'auto',
      hasBackdrop: false,
      backdropClass: 'dialog-backdrop',
      data: { testData: element, testType: testType },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getMyAssignments();
    });
  }

  verifyPasscode(element) {
    console.log('VerifyPasscode received element=>', element);
    if (element.passcode !== null) {
      //popup to ask for passcode and verify it
      console.log(
        'VerifyPasscode received element.passcode=>',
        element.passcode
      );
      Swal.fire({
        title: 'Verify Yourself',
        text: 'Enter Passcode:',
        input: 'text',
        confirmButtonText: 'Verify',
        showCancelButton: true,
        confirmButtonColor: 'rgb(39, 125, 161)',
        cancelButtonColor: 'rgb(221, 51, 51)',
      }).then((result) => {
        if (result.value && result.value == element.passcode) {
          this.openTestPopup(element, 'live');
          this.toastrService.success('Passcode Verified successfully');
        } else if (result.value && result.value != element.passcode) {
          this.toastrService.error('Invalid Passcode');
        }
      });
    }
  }

  viewResult(row: any) {
    this.testConfigService
      .getStudentAssignmentResult(row.assignmentId, this.userName)
      .subscribe(
        (res) => {
          this.router
            .navigate(['/home/dashboard/assignment_report/' + row.assignmentId])
            .then(() => console.log('Navigate to score card'))
            .catch((err) =>
              console.log('Error=> Navigate to score card=>', err)
            );
        },
        (err) => {
          console.log('Error while Fetching Student assignment result =>', err);
        }
      );
  }

  takeTest(row: any) {}

  onTabChanged($event) {
    const filterValue = $event.tab.textLabel;
    let filteredData = this.resultData.filter(
      (d) => d.testName === filterValue
    );
    if (filteredData.length == 0) {
      filteredData = this.resultData;
    }
    this.dataSource = new MatTableDataSource(filteredData);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
