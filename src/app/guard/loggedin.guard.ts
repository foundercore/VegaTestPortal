import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/authentication/auth.service';

@Injectable()
export class LoggedInAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.authService
        .loggedIn()
        .then(() => {
          this.router.navigate(['/home/dashboard']);
          reject(false);
        })
        .catch(() => resolve(true));
    });
  }
}
