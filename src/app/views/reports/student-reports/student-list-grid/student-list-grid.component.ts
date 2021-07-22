import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { PAGE_OPTIONS } from 'src/app/core/constants';
import { IUserResponseModel } from 'src/app/models/user/user-model';
import { TestAssignmentServiceService } from 'src/app/services/assignment/test-assignment-service.service';
import { UserService } from 'src/app/services/users/users.service';
import { TestConfigService } from 'src/app/views/assignments/services/test-config-service';

@Component({
  selector: 'app-student-list-grid',
  templateUrl: './student-list-grid.component.html',
  styleUrls: ['./student-list-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentListGridComponent implements OnInit {

  currentSectionSubmittedData: any;
  studentName: string = '';
  resultData;

  public pageOptions = PAGE_OPTIONS;

  displayedColumns: string[] = ['testName', 'attempted', 'marksObtained','actions'];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    public translate: TranslateService,
    private testAssignmentService: TestAssignmentServiceService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {

    this.activatedRoute.params.subscribe((params) => {
        this.getAssignments(params.student_id);
    })
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
}

