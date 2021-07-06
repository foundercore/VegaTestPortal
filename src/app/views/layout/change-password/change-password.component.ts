import { ChangeAuthInfo } from '../../../state_management/_actions/user.action';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/users/users.service';
import { AppState } from 'src/app/state_management/_states/auth.state';
import { TranslateService } from '@ngx-translate/core';
import { PasswordPolicy } from '../../../shared/utils/password-policy-validator';
import { MustMatch } from 'src/app/shared/utils/must-match-validator';





@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordFormGroup = new FormGroup({
    password  : new FormControl ('', Validators.compose([
            // 1. Password Field is Required
            Validators.required,
            // 2. check whether the entered password has a number
            PasswordPolicy.patternValidator(/\d/, { hasNumber: true }),
            // 3. check whether the entered password has upper case letter
            PasswordPolicy.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
            // 4. check whether the entered password has a lower-case letter
            PasswordPolicy.patternValidator(/[a-z]/, { hasSmallCase: true }),
            // 5. check whether the entered password has a special character
            PasswordPolicy.patternValidator(/[*@!#%&()^~{}]+/, { hasSpecialCharacters: true }),
            // 6. Has a minimum length of 8 characters
            Validators.minLength(8)
    ])),
    confirmPassword: new FormControl ('',  [Validators.required]),
  },MustMatch)

  appState: any;

  constructor( private userService: UserService,
    private tosterService: ToastrService,
    private store: Store<AppState>,
    public translate: TranslateService,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
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
