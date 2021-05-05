import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/authentication/auth.service';
import { AppState } from '../state_management/_states/auth.state';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {

  }


  canActivate(): boolean {
    if (!this.authService.getToken()) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }
}

