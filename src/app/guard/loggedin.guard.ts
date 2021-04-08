import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/authentication/auth.service';

@Injectable()
export class LoggedInAuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): boolean {
        if (this.authService.loggedIn()) {
            this.router.navigate(['/home/dashboard']);
            return false
        } else {
            return true
        }
    }
}