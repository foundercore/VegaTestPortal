import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  pageTitle = 'LOGIN';
  userNamePlaceHolder = 'ramesh@education.com';
  maskPassword = true;
  constructor(
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
  }

  login(): void {
    if (this.username === 'admin' && this.password === 'admin') {
      this.router.navigate(['user']);
    } else {
      //alert('Invalid credentials');
      this.toastr.success("Invalid credentials");
    }
  }

  isFormValid(){
    return this.username.length > 0 && this.password.length > 0;
  }

  onSubmit(form: NgForm) {
    console.log('User Name is : ' + form.value.username);
    if (form.value.username === 'admin' && form.value.password === 'admin') {
      this.router.navigate(['home']);
    } else {
      // alert('Invalid credentials');
       this.toastr.error("Invalid credentials");
    }
  }
}

