import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions, ofType, createEffect } from '@ngrx/effects';
import { map, switchMap, catchError, tap } from 'rxjs/operators';

import { Observable, of } from 'rxjs';
import {
  AuthActionTypes,
  ChangeAuthInfo,
  LogIn,
  LogInFailure,
  LogInSuccess,
} from '../_actions/user.action';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { ToastrService } from 'ngx-toastr';
import { IUserModel, UserModel } from 'src/app/models/user/user-model';

@Injectable()
export class AuthEffects {
  constructor(
    private actions: Actions,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  @Effect()
  LogIn: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGIN),
    map((action: LogIn) => action.payload),
    switchMap((payload: { username: string; password: string }) => {
      return this.authService.logIn(payload.username, payload.password).pipe(
        map((user: any) => {
          console.debug(user);
          return new LogInSuccess(new UserModel(user.principal, btoa(payload.username+':'+ payload.password),user.authorities));
        }),
        catchError((error: any) => {
          console.error(error);
          this.toastr.error('Invalid credentials');
          return of(new LogInFailure({ error: error }));
        })
      );
    })
  );

  @Effect({ dispatch: false })
  LogInSuccess: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGIN_SUCCESS),
    tap((user: any) => {
      this.router.navigateByUrl('/');
    })
  );

  @Effect({ dispatch: false })
  public LogOut: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGOUT),
    tap((user) => {

    })
  );


  @Effect({ dispatch: false })
  ChangeAuthInfo: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.CHANGE_AUTH_INFO),
    tap((user: any) => {

    })
  );

}

