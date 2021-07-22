import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { PAGE_OPTIONS } from 'src/app/core/constants';
import { IUserResponseModel } from 'src/app/models/user/user-model';
import { TestAssignmentServiceService } from 'src/app/services/assignment/test-assignment-service.service';
import { UserService } from 'src/app/services/users/users.service';
import { TestConfigService } from '../assignments/services/test-config-service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsComponent implements OnInit {



  single: any[] | undefined;
  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  searchText: string = '';
  appState: any;
  currentSectionSubmittedData: any;
  studentName: string = '';
  userType: string = '';
  buttontext: string = '';
  createdId: string = '';
  selectedStudent;
  studentList : IUserResponseModel[] = [];
  filteredStudentList: IUserResponseModel[] = [];
  resultData;

  public pageOptions = PAGE_OPTIONS;

  displayedColumns: string[] = ['testName', 'attempted', 'marksObtained','actions'];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    public translate: TranslateService,
    private testAssignmentService: TestAssignmentServiceService,
    public dialog: MatDialog,
    private testConfigService: TestConfigService,
    private router: Router,
    private toastrService: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getUserList().subscribe(
      (data) => {
        this.studentList = data;
        this.filteredStudentList = data;
      },
      (err) => {
      }
    );
  }

  getAssignments(username) {
    this.testAssignmentService.getAssignmentByUsername(username).subscribe((resp) => {
      this.resultData = resp;
      this.dataSource = new MatTableDataSource<any>(this.resultData);
      this.dataSource.paginator = this.paginator;
    });
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  viewResult(row: any) {
    this.router
    .navigate(['/home/reports/student/assignment_report/' + row.assignmentId])
    .then(() => console.log('Navigate to score card'))
    .catch((err) =>
      console.log('Error=> Navigate to score card=>', err)
    );
  }

  selectStudent(data){
    this.selectedStudent = data.value;
    this.getAssignments(data.value.userName);
  }


  search(event) {
    this.filteredStudentList = this.searchStudent(event.target.value);
  }

  searchStudent(value: string) {
    let filter = value.toLowerCase();
    return this.studentList.filter((option) =>
    option.displayName.toLowerCase().includes(filter)
    );
  }
}
