import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
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
import { TestConfigService } from 'src/app/views/assignments/services/test-config-service';

@Component({
  selector: 'app-student-reports',
  templateUrl: './student-reports.component.html',
  styleUrls: ['./student-reports.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentReportsComponent implements OnInit {

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
    public dialog: MatDialog,
    private router: Router,
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  selectStudent(data){
    if(data.value){
      this.router
      .navigate(['/home/reports/student/selected-student/' + data.value.userName],{ state: { example: 'bar' } })
      .then(() => console.log('Navigate to Student Report Selected Student - '+  data.value.userName))
      .catch((err) =>
        console.log('Error=> Navigate to Student Report Selected Student - ' + data.value.userName, err)
      );
    } else {
      this.router
      .navigate(['/home/reports/student'])
      .then(() => console.log('Navigate to Student Report'))
      .catch((err) =>
        console.log('Error => Navigate to Student Report =>', err)
      );
    }
    this.selectedStudent = data.value;
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

