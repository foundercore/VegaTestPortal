import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/authentication/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.authService
        .loggedIn()
        .then(() => resolve(true))
        .catch(() => {
          this.router.navigate(['/login'], {
            queryParams: {
              return: state.url,
            },
          });
          reject(false);
        });
    });
  }
}
