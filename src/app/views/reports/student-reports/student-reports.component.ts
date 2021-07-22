import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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

  displayedColumns: string[] = ['testName', 'attempted', 'marksObtained','actions'];
  show = true;

  constructor(
    public translate: TranslateService,
    public dialog: MatDialog,
    private router: Router,
    private userService: UserService,
    public _router: Router,
    private ref: ChangeDetectorRef

  ) {
    router.events.subscribe((val) => {
      // see also
      if(val instanceof NavigationEnd){
        if(val.url.includes('assignment_report')){
          this.show = false;
        }else{
          this.show = true;
        }
        ref.detectChanges();
      }
  });
  }

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

  }


  selectStudent(data){
    if(data.value){
      this.selectedStudent = data.value;
      this.router
      .navigate(['/home/reports/student/selected-student/' + data.value.userName,data.value.displayName])
      .then(() => console.log('Navigate to Student Report Selected Student - '+  data.value.userName))
      .catch((err) =>
        console.log('Error=> Navigate to Student Report Selected Student - ' + data.value.userName, err)
      );
    } else {
      this.selectedStudent = null;
      this.router
      .navigate(['/home/reports/student'])
      .then(() => console.log('Navigate to Student Report'))
      .catch((err) =>
        console.log('Error => Navigate to Student Report =>', err)
      );
    }
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

