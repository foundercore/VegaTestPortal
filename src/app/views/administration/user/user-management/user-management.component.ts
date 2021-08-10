import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { PAGE_OPTIONS, Role } from 'src/app/core/constants';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { UserService } from 'src/app/services/users/users.service';
import { DialogConformationComponent } from 'src/app/shared/components/dialog-conformation/dialog-conformation.component';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';
import { UserBulkUploadDialogComponent } from '../user-bulk-upload-dialog/user-bulk-upload-dialog.component';
import { ViewStudentBatchDialogComponent } from '../view-student-batch-dialog/view-student-batch-dialog.component';

@Component({
  selector: 'app-user-managemnt',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit, AfterViewInit  {

  displayedColumns: string[] = [
    'select',
    'displayName',
    'email',
    'roles',
    'actions'
  ];

  public pageOptions = PAGE_OPTIONS;

  isLoading: boolean = true;

  selection = new SelectionModel<any>(true, []);

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    public translate: TranslateService,
    public authorizationService: AuthorizationService
  ) {

  }

  ngOnInit(): void {}

  ngAfterViewInit() {
   this.refreshUserList();
  }

  refreshUserList(){
    this.userService.getUserList().subscribe(
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

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
      this.isAllSelected() ?
          this.selection.clear() :
          this.dataSource.data.forEach(row => this.selection.select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
      if (!row) {
        return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }


    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

  deleteBulkUser(): void {
    if (this.selection.selected.length == 0) {
      this.toastr.error('Please select atleast one user');
    } else {
      let userIdList = this.selection.selected.map(
        (x) => x.userName
      );
      this.userService.bulkDeleteUser(userIdList).subscribe(
        (resp) => {
          this.toastr.success('Users Delete SuccessFully');
          this.selection.clear();
          this.refreshUserList();
        },
        (error) => {
          this.toastr.error(error.error.apierror.message);
        }
      );
    }
  }

  performGridAction(type?: string,row?:any) {
    switch (type) {
      case 'upload':
        this.openBulkUploadDialog();
        break;
      case 'add':
        this.openAddUserdDialog();
        break;
      case 'edit':
          this.openEditUserdDialog(row);
          break;
      case 'delete':
          this.deleteUser(row);
          break;
      case 'bulk_delete':
          this.openAddUserdDialog();
          break;
      case 'view':
          this.openViewUserdDialog(row);
          break;
      case 'view_batch':
      this.viewStudentBatchDialog(row);
      break;
      default:
        break;
    }
  }
  openBulkUploadDialog() {
    const dialogRef = this.dialog.open(UserBulkUploadDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      this.refreshUserList();
    });
  }
  openAddUserdDialog() {
    const dialogRef = this.dialog.open(AddUserDialogComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe((result) => {
      this.refreshUserList();
    });
  }

  openEditUserdDialog(row: any) {
    if(this.authorizationService.isStaffRole() && row.roles.includes(Role.ADMIN)){
      this.toastr.error("You don't have access to change info of Admin user.");
      return;
    }

    row.isView = false;
    const dialogRef = this.dialog.open(AddUserDialogComponent, { disableClose: true, data: row });
    dialogRef.afterClosed().subscribe((result) => {
      this.refreshUserList();
    });
  }

  openViewUserdDialog(row: any) {
    row.isView = true;
    const dialogRef = this.dialog.open(AddUserDialogComponent, { disableClose: true, data: row });
    dialogRef.afterClosed().subscribe((result) => {
      this.refreshUserList();
    });
  }

  viewStudentBatchDialog(row: any) {
    row.isView = true;
    const dialogRef = this.dialog.open(ViewStudentBatchDialogComponent, { disableClose: false, data: row });
  }

  deleteUser(user: any){
    const dialogRef = this.dialog.open(DialogConformationComponent, { disableClose: true});
    dialogRef.afterClosed().subscribe((result) => {
      if(result == 'delete'){
        this.userService.deleteUser(user.userName).subscribe(resp => {
          this.refreshUserList();
          this.toastr.success(`User removed.`);
        },error =>{
          this.toastr.error('Unable to delete user');
        })
      }
    });
  }

}
