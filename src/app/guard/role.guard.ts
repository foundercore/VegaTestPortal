import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '../services/authentication/auth.service';
 import { AuthorizationService } from '../services/authorization/authorization.service';
import { AppState } from '../state_management/_states/auth.state';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(
    private authorizationService: AuthorizationService,
    private router: Router,
    private store: Store<AppState>,
    private authService: AuthService,
  ) {

  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (route.data.roles &&   route.data.roles.some(r=> this.authorizationService.getAllRoleTag().includes(r))) {
      return true;
    }
    this.router.navigateByUrl('/login');
    return false;
  }
}

