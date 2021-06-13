import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { PAGE_OPTIONS } from 'src/app/core/constants';
import { TestAssignmentServiceService } from 'src/app/services/assignment/test-assignment-service.service';
import { AppState } from 'src/app/state_management/_states/auth.state';
import Swal from 'sweetalert2';
import { TestLiveComponent } from '../../assignments/popups/test-live/test-live.component';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentDashboardComponent implements OnInit {

  resultStats =[
    {
      "name": "Passed",
      "value": 60
    },
    {
      "name": "Failed",
      "value": 30
    },
  ];

 resultData: any[] = [  ];

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
  createdId : string = "";

  colorScheme = {
    domain: [ '#52D726', '#FF0000']
  };

  public pageOptions = PAGE_OPTIONS;

  displayedColumns: string[] = ['testName', 'attempted',  'actions'];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    public translate: TranslateService,
    private testAssignmentService: TestAssignmentServiceService,
    public dialog : MatDialog,
    private store: Store<AppState>
    ) {

  }


  ngOnInit(): void {
    this.store.select('appState').subscribe((data) => {
      this.userName = data.user.userName;
      this.studentName = data.user.firstName + ' ' + data.user.lastName;
      this.userType = data?.user?.authorities[0]?.authority;
      console.log('data', data);
    });
    this.getMyAssignments();
  }


getMyAssignments(){
  this.testAssignmentService.getMyAssignment().subscribe(resp => {
    this.resultData = resp;
    console.log("this.resultData==",this.resultData);
    this.dataSource = new MatTableDataSource<any>(this.resultData);
    this.dataSource.paginator = this.paginator;
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
      this.buttontext = 'Start Test';
    }
    Swal.fire({
      title: 'Want to start test?',
      text: this.extractContent(element.testName),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#277da1',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Close',
      confirmButtonText: this.buttontext,
    }).then((result) => {
      if (result.isConfirmed) {
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
          this.getMyAssignments();
        });
      }
    });
  }





  viewResult(row:any ){

  }

  takeTest(row:any ){

  }
}
