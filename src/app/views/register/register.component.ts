import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { UserService } from 'src/app/services/users/users.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private userService: UserService,
        private toastr: ToastrService
    ) {
        if (this.authService.getToken()) {
          this.router.navigateByUrl('/home/dashboard');
        }
    }

    ngOnInit() {
    }

    onSubmit(registerForm: NgForm) {
        // stop here if form is invalid
        if (registerForm.invalid) {
            return;
        }

        // api call
        // this.userService.register(this.registerForm.value)
        //     .pipe(first())
        //     .subscribe(
        //         data => {
        //             this.toastr.success('Registration successful', true);
        //             this.router.navigate(['/login']);
        //         },
        //         error => {
        //             this.toastr.error(error);
        //             this.loading = false;
        //         });
    }

}
