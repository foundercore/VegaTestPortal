import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { IUserModel } from 'src/app/models/user/user-model';
import { UserService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-user-managemnt',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  userResponses: Array<IUserModel> = [];
  searchIcon = faSearch;
  userList: Array<IUserModel> = [];

  checkedUserList: Array<IUserModel> = [];

  constructor(private userService: UserService) {
    userService.getUsers().subscribe((data) => {
      this.userList = data;
      this.userResponses = data;
    });
  }

  ngOnInit(): void {}
  searchUser(e: any): void {
    this.userList = this.userResponses.filter((user) => {
      if (user.displayName!.includes(e.value) || user.email!.includes(e.value))
        return user;
      return null;
    });
  }
  checkboxChnaged(e: any, email: string | undefined): void {
    if (e.target.checked)
      this.checkedUserList.push(
        this.userList.find((user) => user.email == email)!
      );
    else
      this.checkedUserList.splice(
        this.checkedUserList.findIndex((user) => user.email == email),
        1
      );
  }
}
