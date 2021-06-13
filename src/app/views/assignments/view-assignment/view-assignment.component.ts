import { AddStudentsComponent } from './../add-students/add-students.component';
import { TestAssignmentServiceService } from './../../../services/assignment/test-assignment-service.service';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { PAGE_OPTIONS, Role } from 'src/app/core/constants';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { UserService } from 'src/app/services/users/users.service';
import { DialogConformationComponent } from 'src/app/shared/components/dialog-conformation/dialog-conformation.component';
import { AddUserDialogComponent } from '../../user/add-user-dialog/add-user-dialog.component';
import { UserBulkUploadDialogComponent } from '../../user/user-bulk-upload-dialog/user-bulk-upload-dialog.component';
import { AssignmentFormComponent } from '../assignment-form/assignment-form.component';
import { StudentBatchService } from 'src/app/services/student-batch/student-batch.service';
import { StudentBatchModel } from 'src/app/models/student-batch/student-batch-model';

@Component({
  selector: 'app-view-assignment',
  templateUrl: './view-assignment.component.html',
  styleUrls: ['./view-assignment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewAssignmentComponent implements OnInit {

  testId;

  displayedColumns: string[] = [];

  availableStudent = new Map();

  batch =  new Map();


  public pageOptions = PAGE_OPTIONS;

  isLoading: boolean = true;

  isUserAdmin = false;

  selection = new SelectionModel<any>(true, []);

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    public translate: TranslateService,
    public authorizationService: AuthorizationService,
    private route: ActivatedRoute,
    private testAssignmentService: TestAssignmentServiceService,
    private toastrService: ToastrService,
    private router: Router,
    private studentBatchService: StudentBatchService,
  ) {
    this.userService.getUserList().subscribe((resp) => {
     resp .filter((x) => x.roles.includes('ROLE_STUDENT')).forEach(x => {
       this.availableStudent.set(x.userName,x.displayName);
     })
     });

     this.studentBatchService.getStudentBatchList().subscribe(data => data.forEach(x => {
       this.batch.set(x.id.batchId,x.name);
     }));
  }

  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get('id');
    this.isUserAdmin = this.authorizationService.isAdmin;
    if(this.isUserAdmin){
      this.displayedColumns = [
        'description',
        'assignedToStudent',
        'assignedToBatch',
       'releaseDate',
       'passcode',
       'validFrom',
       'validTo',
       'actions'
     ];
    } else {
      this.displayedColumns = [
        'description',
        'assignedToStudent',
        'assignedToBatch',
       'releaseDate',
       'passcode',
       'validFrom',
       'validTo',

     ];
    }


  }
  ngAfterViewInit() {
   this.refreshAssignmentList();
  }

  refreshAssignmentList(){
    this.testAssignmentService.getAssignmentListByTestId(this.testId).subscribe(
      (data) => {
        this.isLoading = false;
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
      case 'add':
        this.openAddAssignmentDialog();
        break;
      case 'edit':
          this.openEditAssignmentDialog(row);
          break;
      case 'delete':
          this.delete(row);
          break;
      case 'back':
          this.back();
          break;
      case 'add_student':
          this.addStudent(row);
          break;
      default:
        break;
    }
  }

  openAddAssignmentDialog() {
    const dialogRef = this.dialog.open(AssignmentFormComponent, { disableClose: true,data: { testId:this.testId} });
    dialogRef.afterClosed().subscribe((result) => {
      this.refreshAssignmentList();
    });
  }

  openEditAssignmentDialog(row: any) {
    row.isView = false;
    const dialogRef = this.dialog.open(AssignmentFormComponent, { disableClose: true, data: {
        data:row,
        testId:this.testId   }});
    dialogRef.afterClosed().subscribe((result) => {
      this.refreshAssignmentList();
    });
  }

  addStudent(row: any){
    row.isView = false;
    const dialogRef = this.dialog.open(AddStudentsComponent, { disableClose: true, data: {
        data:row,
        testId:this.testId   }});
    dialogRef.afterClosed().subscribe((result) => {
      this.refreshAssignmentList();
    });
  }
  delete(assignment: any){
    const dialogRef = this.dialog.open(DialogConformationComponent, { disableClose: true});
    dialogRef.afterClosed().subscribe((result) => {
      if(result == 'delete'){
        this.testAssignmentService.deleteAssignment(assignment.assignmentId).subscribe(resp => {
          this.refreshAssignmentList();
          this.toastr.success(`Assignment removed.`);
        },error =>{
          this.toastr.error('Unable to delete user');
        })
      }
    });
  }

  back(){
    this.router.navigate([
      'home/tests/update-test/' + this.testId
    ]);
  }

  getFormatedStudentList(studentsList){
    if(studentsList){
      return studentsList.map(x => this.availableStudent.get(x));
    } else {
      return 'No Student Assigned'
    }
  }

  getFormatedBatchList(batchList){
    if(batchList && batchList.length != 0){
      return batchList.map(x => this.batch.get(x));
    } else {
      return 'No Batch Assigned'
    }
  }

}
