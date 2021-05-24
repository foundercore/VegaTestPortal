import { AddBatchStudentComponent } from './../add-batch-student/add-batch-student.component';
import { StudentBatchModel } from './../../../models/student-batch/student-batch-model';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, merge } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { PAGE_OPTIONS } from 'src/app/core/constants';
import { QuestionModel } from 'src/app/models/questions/question-model';
import { SearchQuestion } from 'src/app/models/questions/search-question-model';
import { QuestionManagementService } from 'src/app/services/question-management/question-management.service';
import { StudentBatchService } from 'src/app/services/student-batch/student-batch.service';
import { QuestionBulkUploadDialogComponent } from '../../questions/question-bulk-upload-dialog/question-bulk-upload-dialog.component';
import { AddUserDialogComponent } from '../../user/add-user-dialog/add-user-dialog.component';
import { UserBulkUploadDialogComponent } from '../../user/user-bulk-upload-dialog/user-bulk-upload-dialog.component';
import { AddBatchComponent } from '../add-batch/add-batch.component';
import { BulkUploadBatchStudentsComponent } from '../bulk-upload-batch-students/bulk-upload-batch-students.component';

@Component({
  selector: 'app-student-batch-management',
  templateUrl: './student-batch-management.component.html',
  styleUrls: ['./student-batch-management.component.scss']
})
export class StudentBatchManagementComponent implements OnInit {

  displayedColumns: string[] = [
    'name',
    'description',
    'student_count',
    'actions'
  ];

  public pageOptions = PAGE_OPTIONS;

  isLoading: boolean = true;

  dataSource = new MatTableDataSource<StudentBatchModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private studentBatchService: StudentBatchService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {

  }

  ngOnInit(): void {}

  ngAfterViewInit() {
   this.refreshUserList();
  }

  refreshUserList(){
    this.studentBatchService.getStudentBatchList().subscribe(
      (data) => {
        this.isLoading = false;
        data.forEach(x => x.student_count = x.students !== null ? x.students.length : 0);
        this.dataSource = new MatTableDataSource<any>(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (err) => {
        this.isLoading = false;
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


  performGridAction(type?: string,row?:any) {
    switch (type) {
      case 'upload':
        this.openBulkUploadDialog();
        break;
      case 'add':
        this.openAddBatchDialog();
        break;
      case 'delete':
          this.deleteStudentBatch(row);
          break;
      case 'add_student':
          this.openAddStudentDialog(row);
          break;
      case 'view':
          this.openPreviwBatchDialog(row);
          break;
      default:
        break;
    }
  }

  openBulkUploadDialog() {
    const dialogRef = this.dialog.open(BulkUploadBatchStudentsComponent);
    dialogRef.afterClosed().subscribe((result) => {
      this.refreshUserList();
    });

  }

  openPreviwBatchDialog(row) {
    const dialogRef = this.dialog.open(AddBatchComponent, { disableClose: true,data:row });
    dialogRef.afterClosed().subscribe((result) => {
      this.refreshUserList();
    });
  }

  openAddBatchDialog() {
    const dialogRef = this.dialog.open(AddBatchComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe((result) => {
      this.refreshUserList();
    });
  }

  openAddStudentDialog(row:any){
    const dialogRef = this.dialog.open(AddBatchStudentComponent, { disableClose: true, data: row });
    dialogRef.afterClosed().subscribe((result) => {
      this.refreshUserList();
    });
  }

  deleteStudentBatch(batchObj: StudentBatchModel){
    this.studentBatchService.removeStudentBatch(batchObj.id.batchId).subscribe(resp => {
      this.refreshUserList();
      this.toastr.success(`${batchObj.name} Batch removed.`);
    },error =>{
      this.toastr.error(`${batchObj.name} Batch unable to removed.`);
    })
  }
}
