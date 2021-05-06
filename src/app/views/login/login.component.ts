import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { LogIn } from 'src/app/state_management/_actions/user.action';
import { AppState } from 'src/app/state_management/_states/auth.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  pageTitle = 'LOGIN';
  userNamePlaceHolder = 'ramesh@education.com';
  maskPassword = true;
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}

  login(): void {
    if (this.username === 'admin' && this.password === 'admin') {
      this.router.navigate(['user']);
    } else {
      this.toastr.success('Invalid credentials');
    }
  }

  isFormValid() {
    return this.username.length > 0 && this.password.length > 0;
  }

  onSubmit(form: NgForm) {
    const payload = {
      username: form.value.username,
      password: form.value.password
    };
    this.store.dispatch(new LogIn(payload));
  }
}
