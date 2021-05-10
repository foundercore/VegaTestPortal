import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { IUserModel } from 'src/app/models/user/user-model';
import { UserService } from 'src/app/services/users/users.service';

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

  constructor(private userService: UserService, public dialog: MatDialog) {
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
}
