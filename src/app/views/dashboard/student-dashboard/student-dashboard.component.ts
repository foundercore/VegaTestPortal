import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectorRef,
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
import { TestConfigService } from '../../assignments/services/test-config-service';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class StudentDashboardComponent implements OnInit {



  public typeFilter = (x,selectedTabName) => {
    if(selectedTabName == "Other"){
      return  x.testType == "null" || x.testType == null
    } else {
      return  x.testType == selectedTabName
    }
  };

  public attemptedFilter = (x,filterValue) => {
        if(filterValue == "A") {
          return  x.attempted
        } else if (filterValue == "UA"){
          return !x.attempted
        }
      return true;
  };


  tagArray = [];

  resultData: any[] = [];

  currentFilterValue = "NA";

  selectedTabIndex = new FormControl(0);


  searchText: string = '';
  appState: any;
  userName: string = '';
  currentSectionSubmittedData: any;
  studentName: string = '';
  userType: string = '';
  buttontext: string = '';
  createdId: string = '';
  isLoading = true;


  public pageOptions = PAGE_OPTIONS;

  displayedColumns: string[] = [
    'testName',
    'attempted',
    'marksObtained',
    'actions',
  ];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator | undefined;

  totalTest: number;
  notAttempted: number;
  attempt: number;

  constructor(
    public translate: TranslateService,
    private testAssignmentService: TestAssignmentServiceService,
    public dialog: MatDialog,
    private store: Store<AppState>,
    private testConfigService: TestConfigService,
    private router: Router,
    private toastrService: ToastrService,
    private changeDetectorRef: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this.store.select('appState').subscribe((data) => {
      this.userName = data?.user?.userName;
      this.studentName = data?.user?.firstName + ' ' + data?.user?.lastName;
      this.userType = data?.user?.authorities[0]?.authority;
    });
    this.getMyAssignments();
  }

  getMyAssignments() {
    this.isLoading = true;
    this.testAssignmentService.getMyAssignment().subscribe(
      (resp) => {
        this.resultData = resp;
        const stats = this.getDataStats();
        this.totalTest = stats.totalTest;
        this.notAttempted = this.totalTest - stats.attempted;
        this.attempt = stats.attempted;
        this.tagArray = [...stats.tagSets];
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
        this.onTabChanged(0);
        this.changeDetectorRef.detectChanges();
      },
      (err) => {
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  extractContent(s) {
    var span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  }

  startTest(element) {
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
    this.router.navigate([ '/live_test', element.testId,element.assignmentId]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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


  onTabChanged(index) {
    this.selectedTabIndex.setValue(index)
    let filterData = this.filterData(this.tagArray[index],this.currentFilterValue);
    this.dataSource.paginator = this.paginator;
    this.dataSource.data = filterData;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  statsFilter(filterParam) {
    this.currentFilterValue = filterParam;
    let filterData = this.filterData(this.tagArray[this.selectedTabIndex.value],this.currentFilterValue);
    this.dataSource.paginator = this.paginator;
    this.dataSource.data = filterData;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterData(selectedTabName,filterValue){
    let filteredData = this.resultData.filter( x => this.attemptedFilter(x,filterValue) && this.typeFilter(x,selectedTabName));
     return filteredData;
  }

  getDataStats (){
    let stats = {
      tagSets : new Set([]),
      attempted: 0,
      totalTest: 0
    }
    let isOtherTag = false;
    this.resultData.forEach((assignment) => {
      if (assignment.attempted) {
        stats.attempted ++;
      }
      if (assignment.testType === null || assignment.testType === 'null') {
        isOtherTag = true;
      } else if (assignment.testType != null) {
        stats.tagSets.add(assignment.testType);
      }
    });
    if(isOtherTag){
      stats.tagSets.add("Other");
    }
    stats.totalTest = this.resultData.length;
    return stats;
  }
}
