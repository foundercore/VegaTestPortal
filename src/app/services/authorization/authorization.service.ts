import { Injectable, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state_management/_states/auth.state';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService   {


  accessRoleList:string[];

  constructor(private store: Store<AppState>) {
    this.store.select('appState').subscribe((data) => {
      if(data.user)
             this.accessRoleList = data.user.authorities?.map(x => x.authority);
      else
              this.accessRoleList = [];
    });
  }

  getAllRoleTag(){
    return this.accessRoleList;
  }

  get isStudent() {
    return this.accessRoleList.includes("ROLE_STUDENT");
  }

  get isAdmin() {
    return this.accessRoleList.includes("ROLE_USER_ADMIN");
  }

  get isAdminAndStaff() {
    return this.accessRoleList.includes("ROLE_USER_ADMIN") || this.accessRoleList.includes("ROLE_STAFF");
  }

  get isStaff() {
    return this.accessRoleList.includes("ROLE_STAFF");
  }

  public isStaffRole() {
    return this.accessRoleList.includes("ROLE_STAFF");
  }

  public isAdminRole() {
    return this.accessRoleList.includes("ROLE_USER_ADMIN");
  }
}
