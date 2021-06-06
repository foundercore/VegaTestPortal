import { ChangeAuthInfo } from './../../../state_management/_actions/user.action';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/users/users.service';
import { AppState } from 'src/app/state_management/_states/auth.state';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';
import { TranslateService } from '@ngx-translate/core';

export function MustMatch(g: FormGroup) {

      const control = g.controls['password'];
      const matchingControl = g.controls['confirmPassword'];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          // return if another validator has already found an error on the matchingControl
          return matchingControl.errors;

      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
          return matchingControl.errors;
      } else {
          matchingControl.setErrors(null);
          return matchingControl.errors;
      }

}



@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordFormGroup = new FormGroup({
    password  : new FormControl ('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl ('',  [Validators.required]),
  },MustMatch)

  appState: any;

  constructor( private userService: UserService,
    private tosterService: ToastrService,
    private store: Store<AppState>,
    public translate: TranslateService,
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.store.select('appState').subscribe(data =>
      {
        this.appState = data;
      });
  }

  changePassword(){
    if(!this.changePasswordFormGroup.invalid){
        this.userService.changePassword(this.changePasswordFormGroup.controls['password'].value).subscribe(resp => {
          this.tosterService.success("Password change successfully");
          this.store.dispatch(new ChangeAuthInfo({user: {} ,password:this.changePasswordFormGroup.controls['password'].value}));
          this.dialogRef.close();
        },error => {
          this.tosterService.error("Failed to change password");
        })

    } else {
      return
    }
  }


  reset(){
    this.changePasswordFormGroup.reset();
  }

}
