import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { IUserCreateRequestModel } from 'src/app/models/user/user-model';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { UserService } from 'src/app/services/users/users.service';
import { MustMatch } from '../user/change-password/change-password.component';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {

  registerFormGroup = new FormGroup({
    firstname: new FormControl('',[Validators.required]),
    lastname: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required,Validators.email]  ),
    password: new FormControl('',[Validators.required,Validators.minLength(6)]),
    confirmPassword: new FormControl('',[Validators.required]),
  },MustMatch)


    constructor(
        private router: Router,
        private authService: AuthService,
        private userService: UserService,
        public translate: TranslateService,
        private tosterService: ToastrService
    ) {
        if (this.authService.getToken()) {
          this.router.navigateByUrl('/home/dashboard');
        }
    }

    ngOnInit() {
    }

    register() {
        if (this.registerFormGroup.invalid) {
            return;
        }
        const user : IUserCreateRequestModel = {
          displayName: this.registerFormGroup.controls.firstname.value + ' ' + this.registerFormGroup.controls.lastname.value,
          firstName:  this.registerFormGroup.controls.firstname.value,
          lastName:  this.registerFormGroup.controls.lastname.value,
          roles:  ["ROLE_STUDENT"],
          password: this.registerFormGroup.controls.password.value,
          email: this.registerFormGroup.controls.email.value,
        }
        this.userService.createUsers(user).subscribe(resp => {
          this.tosterService.success('Registration successful');
          this.router.navigate(['/login']);
        },error => {
          this.tosterService.error(error.error.apierror.message);
        });
    }

}
