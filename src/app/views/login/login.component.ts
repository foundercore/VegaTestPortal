import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/authentication/auth.service';

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
    private toastr: ToastrService
  ) {}

  ngOnInit() {}

  login(): void {
    if (this.username === 'admin' && this.password === 'admin') {
      this.router.navigate(['user']);
    } else {
      //alert('Invalid credentials');
      this.toastr.success('Invalid credentials');
    }
  }

  isFormValid() {
    return this.username.length > 0 && this.password.length > 0;
  }

  onSubmit(form: NgForm) {
    console.log('User Name is : ' + form.value.username);
    localStorage.setItem(
      'authInfo',
      btoa(`${form.value.username}:${form.value.password}`)
    );
    this.authService
      .loggedIn()
      .then(() => this.router.navigate(['home']))
      .catch(() => this.toastr.error('Invalid credentials'));
  }
}
