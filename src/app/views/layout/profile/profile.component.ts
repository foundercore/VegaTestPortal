import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { IUserUpdateRequestModel } from 'src/app/models/user/user-model';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { UserService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {

  profileObj;
  updateProfileScopes;

  userFormGroup = new FormGroup({
    firstname: new FormControl('',[Validators.required]),
    lastname: new FormControl('',[Validators.required]),
    displayName: new FormControl('',[Validators.required]),
    gender: new FormControl('',[Validators.required]),
    address: new FormControl('',[Validators.required]),
    state: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required,Validators.email]),
    enabled: new FormControl(),
    roles: new FormControl(),
    userName: new FormControl(),
  })

  constructor(
    private userService: UserService,
    private tosterService: ToastrService,
    public translate: TranslateService,
    public dialogRef: MatDialogRef<ProfileComponent>,
    private authService: AuthorizationService
    ) {

     }

  ngOnInit(): void {
    this.updateProfileScopes = {
      ROLE_STUDENT: ['firstname', 'displayName', 'address', 'gender', 'lastname', 'state', 'email'],
      ROLE_ADMIN: [],
      ROLE_STAFF: [],
    } // fetch update scopes
    this.updateProfileScopes[this.authService.getAllRoleTag()[0]].forEach(scope => {
      this.userFormGroup.controls[scope].disable();
    });
      this.userService.getProfile().subscribe(resp => {
        this.userFormGroup.controls.firstname.setValue(resp.firstName);
        this.userFormGroup.controls.displayName.setValue(resp.displayName);
        this.userFormGroup.controls.address.setValue(resp.address);
        this.userFormGroup.controls.gender.setValue(resp.gender);
        this.userFormGroup.controls.lastname.setValue(resp.lastName);
        this.userFormGroup.controls.state.setValue(resp.state);
        this.userFormGroup.controls.email.setValue(resp.email);
        this.userFormGroup.controls.enabled.setValue(resp.enabled);
        this.userFormGroup.controls.roles.setValue(resp.roles);
        this.userFormGroup.controls.userName.setValue(resp.userName);
      })
  }

  updateProfile(){
    if (this.userFormGroup.invalid) {
      return;
    }
    const user : IUserUpdateRequestModel = {
      address: this.userFormGroup.controls.address.value,
      displayName: this.userFormGroup.controls.displayName.value,
      firstName:  this.userFormGroup.controls.firstname.value,
      gender:  this.userFormGroup.controls.gender.value,
      lastName:  this.userFormGroup.controls.lastname.value,
      roles:  this.userFormGroup.controls.roles.value,
      state:  this.userFormGroup.controls.state.value,
      enabled: this.userFormGroup.controls.enabled.value
    }
    this.userService.updateUsers(user,this.userFormGroup.controls.userName.value).subscribe(resp => {
      this.tosterService.success('Profile is updated successfully');
      this.dialogRef.close();
    },error => {
      this.tosterService.error(error.error.apierror.message);
    });
  }

  reset(){
    this.userFormGroup.reset();
  }

}
