import { ToastrService } from 'ngx-toastr';
import {
  IUserCreateRequestModel,
  IUserUpdateRequestModel,
} from './../../../../models/user/user-model';
import { UserService } from 'src/app/services/users/users.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
 import { TranslateService } from '@ngx-translate/core';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { MustMatch } from 'src/app/shared/utils/must-match-validator';
import { PasswordPolicy } from 'src/app/shared/utils/password-policy-validator';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss'],
})
export class AddUserDialogComponent implements OnInit {
  roleList: string[] = [];

  userFormGroup = new FormGroup(
    {
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      roles: new FormControl([], [Validators.required]),
      address: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        // 1. Password Field is Required
        Validators.required,
        // 2. check whether the entered password has a number
        PasswordPolicy.patternValidator(/\d/, { hasNumber: true }),
        // 3. check whether the entered password has upper case letter
        PasswordPolicy.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        // 4. check whether the entered password has a lower-case letter
        PasswordPolicy.patternValidator(/[a-z]/, { hasSmallCase: true }),
        // 5. check whether the entered password has a special character
        PasswordPolicy.patternValidator(/[*@!#%&()^~{}]+/, {
          hasSpecialCharacters: true,
        }),
        // 6. Has a minimum length of 8 characters
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    MustMatch
  );

  constructor(
    private userService: UserService,
    private tosterService: ToastrService,
    public translate: TranslateService,
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    public authorizationService: AuthorizationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userService.getRoleList().subscribe((resp) => (this.roleList = resp));
  }

  ngOnInit(): void {
    console.log(this.data);
    if (this.data) {
      this.userFormGroup.controls.firstname.setValue(this.data.firstName);
      this.userFormGroup.controls.address.setValue(this.data.address);
      this.userFormGroup.controls.gender.setValue(this.data.gender);
      this.userFormGroup.controls.lastname.setValue(this.data.lastName);
      this.userFormGroup.controls.roles.setValue(this.data.roles);
      this.userFormGroup.controls.state.setValue(this.data.state);
      this.userFormGroup.controls.email.setValue(this.data.email);
      this.userFormGroup.controls.password.setValidators([]);
      this.userFormGroup.controls.confirmPassword.setValidators([]);
      this.userFormGroup.controls.email.disable();
      if (this.data.isView || !this.authorizationService.isAdmin) {
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

  createUser() {
    if (this.userFormGroup.invalid) {
      return;
    }
    const user: IUserCreateRequestModel = {
      address: this.userFormGroup.controls.address.value,
      displayName:
        this.userFormGroup.controls.firstname.value +
        ' ' +
        this.userFormGroup.controls.lastname.value,
      firstName: this.userFormGroup.controls.firstname.value,
      gender: this.userFormGroup.controls.gender.value,
      lastName: this.userFormGroup.controls.lastname.value,
      roles: this.userFormGroup.controls.roles.value,
      state: this.userFormGroup.controls.state.value,
      password: this.userFormGroup.controls.password.value,
      email: this.userFormGroup.controls.email.value.toLowerCase(),
    };
    this.userService.createUsers(user).subscribe(
      (resp) => {
        this.tosterService.success('User is created successfully');
        this.dialogRef.close();
      },
      (error) => {
        this.tosterService.error(error.error.apierror.message);
      }
    );
  }

  updateUser() {
    if (this.userFormGroup.invalid || !this.authorizationService.isAdmin) {
      return;
    }
    const user: IUserUpdateRequestModel = {
      address: this.userFormGroup.controls.address.value,
      displayName: this.data.displayName,
      firstName: this.userFormGroup.controls.firstname.value,
      gender: this.userFormGroup.controls.gender.value,
      lastName: this.userFormGroup.controls.lastname.value,
      roles: this.userFormGroup.controls.roles.value,
      state: this.userFormGroup.controls.state.value,
      enabled: this.data.enabled,
    };
    this.userService.updateUsers(user, this.data.userName).subscribe(
      (resp) => {
        this.tosterService.success('User is updated successfully');
        this.dialogRef.close();
      },
      (error) => {
        this.tosterService.error(error.error.apierror.message);
      }
    );
  }

  reset() {
    this.userFormGroup.reset();
  }
}
