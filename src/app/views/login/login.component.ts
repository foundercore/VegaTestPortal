import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  userNamePlaceHolder = 'ramesh@education.com';
  maskPassword = true;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  login(): void {
    if (this.username === 'admin' && this.password === 'admin') {
      this.router.navigate(['user']);
    } else {
      alert('Invalid credentials');
    }
  }

  isFormValid(){
    return this.username.length > 0 && this.password.length > 0;
  }

  onSubmit(form: NgForm) {
    console.log('User Name is : ' + form.value.username);
  }
}

