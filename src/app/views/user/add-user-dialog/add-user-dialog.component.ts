import { ToastrService } from 'ngx-toastr';
import { IUserCreateRequestModel, IUserUpdateRequestModel } from './../../../models/user/user-model';
import { UserService } from 'src/app/services/users/users.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MustMatch } from '../change-password/change-password.component';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss'],
})
export class AddUserDialogComponent implements OnInit {

  roleList : string[] = [];

  userFormGroup = new FormGroup({
    firstname: new FormControl('',[Validators.required]),
    lastname: new FormControl('',[Validators.required]),
    gender: new FormControl('',[Validators.required]),
    roles: new FormControl([],[Validators.required]),
    address: new FormControl('',[Validators.required]),
    state: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required,Validators.email]  ),
    password: new FormControl('',[Validators.required,Validators.minLength(6)]),
    confirmPassword: new FormControl('',[Validators.required]),
  },MustMatch)

  constructor(
    private userService: UserService,
    private tosterService: ToastrService,
    public translate: TranslateService,
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userService.getRoleList().subscribe(resp => this.roleList = resp);
  }

  ngOnInit(): void {
      console.log(this.data)
      if(this.data){
        this.userFormGroup.controls.firstname.setValue(this.data.firstName);
        this.userFormGroup.controls.address.setValue(this.data.address);
        this.userFormGroup.controls.gender.setValue(this.data.gender);
        this.userFormGroup.controls.lastname.setValue(this.data.lastName);
        this.userFormGroup.controls.roles.setValue(this.data.roles);
        this.userFormGroup.controls.state.setValue(this.data.state);
        this.userFormGroup.controls.email.setValue(this.data.email);
        this.userFormGroup.controls.password.setValidators([]);
        this.userFormGroup.controls.confirmPassword.setValidators([]);
        if(this.data.isView){
          this.userFormGroup.controls.firstname.disable();
          this.userFormGroup.controls.address.disable();
          this.userFormGroup.controls.gender.disable();
          this.userFormGroup.controls.lastname.disable();
          this.userFormGroup.controls.roles.disable();
          this.userFormGroup.controls.state.disable();
          this.userFormGroup.controls.email.disable();
        }
      }

  }


  createUser(){
    if (this.userFormGroup.invalid) {
      return;
    }
    const user : IUserCreateRequestModel = {
      address: this.userFormGroup.controls.address.value,
      displayName: this.userFormGroup.controls.firstname.value + ' ' + this.userFormGroup.controls.lastname.value,
      firstName:  this.userFormGroup.controls.firstname.value,
      gender:  this.userFormGroup.controls.gender.value,
      lastName:  this.userFormGroup.controls.lastname.value,
      roles:  this.userFormGroup.controls.roles.value,
      state:  this.userFormGroup.controls.state.value,
      password: this.userFormGroup.controls.password.value,
      email: this.userFormGroup.controls.email.value,
    }
    this.userService.createUsers(user).subscribe(resp => {
      this.tosterService.success('User is created successfully');
      this.dialogRef.close();
    },error => {
      this.tosterService.error(error.error.apierror.message);
    });
  }

  updateUser(){
    if (this.userFormGroup.invalid) {
      return;
    }
    const user : IUserUpdateRequestModel = {
      address: this.userFormGroup.controls.address.value,
      displayName: this.data.displayName,
      firstName:  this.userFormGroup.controls.firstname.value,
      gender:  this.userFormGroup.controls.gender.value,
      lastName:  this.userFormGroup.controls.lastname.value,
      roles:  this.userFormGroup.controls.roles.value,
      state:  this.userFormGroup.controls.state.value,
      email: this.userFormGroup.controls.email.value,
      enabled: this.data.enabled
    }
    this.userService.updateUsers(user,this.data.userName).subscribe(resp => {
      this.tosterService.success('User is updated successfully');
      this.dialogRef.close();
    },error => {
      this.tosterService.error(error.error.apierror.message);
    });
  }

  reset(){
    this.userFormGroup.reset();
  }
}
