import { BreadcrumbNavService } from './../../../layout/breadcrumb/breadcrumb-nav.service';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PAGE_OPTIONS } from 'src/app/core/constants';
import { TestAssignmentServiceService } from 'src/app/services/assignment/test-assignment-service.service';
import { DialogConformationComponent } from 'src/app/shared/components/dialog-conformation/dialog-conformation.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-student-list-grid',
  templateUrl: './student-list-grid.component.html',
  styleUrls: ['./student-list-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentListGridComponent implements OnInit {
  showGrid = true;
  currentSectionSubmittedData: any;
  studentName: string = '';
  studentId: string = '';
  resultData;
  input: string;

  public pageOptions = PAGE_OPTIONS;

  displayedColumns: string[] = [
    'testName',
    'attempted',
    'marksObtained',
    'actions',
  ];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    public translate: TranslateService,
    private testAssignmentService: TestAssignmentServiceService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private ref: ChangeDetectorRef
  ) {
    router.events.subscribe((val) => {
      // see also
      if (val instanceof NavigationEnd) {
        if (val.url.includes('assignment_report')) {
          this.showGrid = false;
        } else {
          this.showGrid = true;
        }
        ref.detectChanges();
      }
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.getAssignments(params.student_id);
      this.studentName = params.student_name;
      this.studentId = params.student_id;
      this.clear();
    });
  }

  getAssignments(username) {
    this.testAssignmentService
      .getAssignmentByUsername(username)
      .subscribe((resp) => {
        this.resultData = resp;
        this.dataSource = new MatTableDataSource<any>(this.resultData);
        this.dataSource.paginator = this.paginator;
      });
  }

  viewResult(row: any) {
    console.log(
      '/home/reports/student/selected-student/' +
        this.studentId +
        '/' +
        this.studentName +
        '/assignment_report/' +
        row.assignmentId
    );
    this.router
      .navigate([
        '/home/reports/student/selected-student/' +
          this.studentId +
          '/' +
          this.studentName +
          '/assignment_report/' +
          row.assignmentId,
      ])
      .then(() => console.log('Navigate to score card'))
      .catch((err) => console.log('Error=> Navigate to score card=>', err));
  }

  resetTest(row: any) {
    console.log(row);
    const dialogRef = this.dialog.open(DialogConformationComponent, {
      disableClose: true,
      data: { primaryBtnText: 'Close', secondaryBtnText: 'Reset' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'delete') {
        this.testAssignmentService
          .resetStudentAssignment(row.assignmentId, this.studentId)
          .subscribe(
            (resp) => {
              this.toastr.success(`Successfully test is reset.`);
              this.getAssignments(this.studentId);
            },
            (error) => {
              this.toastr.error('Unable to reset test');
            }
          );
      }
    });
  }

  clear() {
    this.input = '';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
