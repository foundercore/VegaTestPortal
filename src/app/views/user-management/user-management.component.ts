import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface IUser {
  _id: number;
  name: string;
  email: string;
  phone: number;
  batch: number;
}

@Component({
  selector: 'app-user-managemnt',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementComponent implements OnInit {
  userResponses: Array<IUser> = new Array(8).fill({
    _id: Math.random() * 97,
    name: 'Jhon Doe',
    email: 'jhone.doe@email.co',
    phone: 9898786776,
    batch: 2021,
  });
  searchIcon = faSearch;
  userList: Array<IUser>;

  checkedUserList: Array<IUser> = [];

  constructor() {
    this.userList = this.userResponses;
  }

  ngOnInit(): void {}
  searchUser(e: any): void {
    this.userList = this.userResponses.filter((user) => {
      if (user.name.includes(e.value) || user.email.includes(e.value))
        return user;
      return null;
    });
    console.log(e.value);
  }
  checkboxChnaged(e: any, userID: number): void {
    if (e.target.checked)
      this.checkedUserList.push(
        this.userList.find((user) => user._id == userID)!
      );
    else
      this.checkedUserList.splice(
        this.checkedUserList.findIndex((user) => user._id == userID),
        1
      );
  }
}
