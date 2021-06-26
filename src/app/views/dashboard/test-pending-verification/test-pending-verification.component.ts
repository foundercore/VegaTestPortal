 import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { PAGE_OPTIONS } from 'src/app/core/constants';
 import { CustomDialogConfirmationModel } from 'src/app/shared/components/custom-dialog-confirmation/custom-dialog-confirmation-model';
import { CustomDialogConfirmationComponent } from 'src/app/shared/components/custom-dialog-confirmation/custom-dialog-confirmation.component';
import { AppState } from 'src/app/state_management/_states/auth.state';
 import { SearchQuestionPaperVM } from '../../assignments/models/searchQuestionPaperVM';
 import { TestLiveComponent } from '../../assignments/popups/test-live/test-live.component';
import { TestConfigService } from '../../assignments/services/test-config-service';

@Component({
  selector: 'app-test-pending-verification',
  templateUrl: './test-pending-verification.component.html',
  styleUrls: ['./test-pending-verification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestPendingVerificationComponent implements OnInit, AfterViewInit {

  public pageOptions = PAGE_OPTIONS;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  totalNumberOfRecords = 0;

  dataSource = new MatTableDataSource<any>();

  alltest = [];

  displayedColumns: string[] = [
     'name',
    'status',
    'actions',
  ];

  searchText: string = '';
  appState: any;
  userName: string = '';
  currentSectionSubmittedData: any;
  studentName: string = '';
  userType: string = '';
  buttontext: string = '';
  createdId: string = '';
  searchQuestionPaperModel = new SearchQuestionPaperVM();
  isLoadingResults: boolean;
  isRateLimitReached: boolean;

  constructor(
    private testConfigService: TestConfigService,
    public dialog: MatDialog,
    public toastrService: ToastrService,
    private router: Router,
    private store: Store<AppState>
  ) {

  }

  ngOnInit(): void {

  }


  ngAfterViewInit(): void {
    this.store.select('appState').subscribe((data) => {
      this.userName = data.user.userName;
      this.studentName = data.user.firstName + ' ' + data.user.lastName;
      this.userType = data?.user?.authorities[0]?.authority;
      console.log('data', data);
    });

   this.getAllPendingTest();
  }


  getAllPendingTest(){
    this.isLoadingResults = true;
    this.testConfigService.getPendingVerficationTest().subscribe(resp => {
      this.isLoadingResults = false;
      this.isRateLimitReached = false;
      this.dataSource.data = resp;
      this.dataSource.paginator = this.paginator;
    },error => {
      this.isLoadingResults = false;
      this.isRateLimitReached = true;
    })
  }


  startTest(element) {
    if (this.userType === 'ROLE_USER_ADMIN') {
      this.buttontext = 'Preview Test';
    } else {
      this.buttontext = 'Start Test';
    }

    const dialogData = new CustomDialogConfirmationModel("Want to start test?", element.instructions, this.buttontext, 'Cancel');

    const dialogRef = this.dialog.open(CustomDialogConfirmationComponent, {
      width: "600px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult){
          const dialogRef = this.dialog.open(TestLiveComponent, {
            maxWidth: '1700px',
            width: '100%',
            minHeight: '100vh',
            height: 'auto',
            hasBackdrop: false,
            backdropClass: 'dialog-backdrop',
            data: { testData: element, userType: this.userType },
          });
          dialogRef.afterClosed().subscribe((result) => {
            this.getAllPendingTest();
          });
      }
    });
  }

  applyFilter() {
    this.searchQuestionPaperModel.nameRegexPattern = this.searchText
      .trim()
      .toLowerCase();
    this.getAllPendingTest();
  }

}
