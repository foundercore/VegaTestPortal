import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { IUserModel } from 'src/app/models/user/user-model';
import { UserService } from 'src/app/services/users/users.service';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';
import { UserBulkUploadDialogComponent } from '../user-bulk-upload-dialog/user-bulk-upload-dialog.component';

@Component({
  selector: 'app-user-managemnt',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'name',
    'email',
    'phone_number',
    'batch',
  ];
  isLoading: boolean = true;
  totalUsers: number = 0;
  userResponses: Array<IUserModel> = [];
  searchIcon = faSearch;
  userList: Array<IUserModel> = [];

  checkedUserList: Array<IUserModel> = [];

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {
    userService.getUsers().subscribe(
      (data) => {
        this.isLoading = false;
        this.userList = data;
        this.userResponses = data;
        this.totalUsers = data.length;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {}
  searchUser(e: any): void {
    this.userList = this.userResponses.filter((user) => {
      if (user.displayName!.includes(e.value) || user.email!.includes(e.value))
        return user;
      return null;
    });
  }
  checkboxChnaged(e: any, user: IUserModel): void {
    if (e.checked) this.checkedUserList.push(user);
    else
      this.checkedUserList.splice(
        this.checkedUserList.findIndex((u) => u.email == user.email),
        1
      );
    console.log(this.checkedUserList);
  }

  deleteUser(): void {
    if (!this.checkedUserList.length) return;
    const userToDelete = this.checkedUserList[0];
    this.userService.deleteUser(userToDelete.userName).subscribe(
      (data) => {
        this.checkedUserList.shift();
        this.userList.splice(
          this.userList.findIndex((u) => u.email == userToDelete.email),
          1
        );
        this.toastr.success(`User removed.`);
      },
      (err) => this.toastr.error('Unable to delete user')
    );
  }

  performGridAction(type?: string) {
    switch (type) {
      case 'upload':
        this.openBulkUploadDialog();
        break;
      case 'add':
        this.openAddUserdDialog();
        break;
      default:
        break;
    }
  }
  openBulkUploadDialog() {
    const dialogRef = this.dialog.open(UserBulkUploadDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  openAddUserdDialog() {
    const dialogRef = this.dialog.open(AddUserDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
