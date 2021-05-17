import { Action } from '@ngrx/store';


export enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGIN_SUCCESS = '[Auth] Login Success',
  LOGIN_FAILURE = '[Auth] Login Failure',
  LOGOUT = '[Auth] Logout',
  CHANGE_AUTH_INFO = '[Auth] Change AUTH INFO',
  RETRIVE_STATE = '[Auth] Retrive State'
}

export class LogIn implements Action {
  readonly type = AuthActionTypes.LOGIN;
  constructor(public payload: any) {}
}

export class LogInSuccess implements Action {
  readonly type = AuthActionTypes.LOGIN_SUCCESS;
  constructor(public payload: any) {}
}

export class LogInFailure implements Action {
  readonly type = AuthActionTypes.LOGIN_FAILURE;
  constructor(public payload: any) {}
}

export class LogOut implements Action {
  readonly type = AuthActionTypes.LOGOUT;
}

export class ChangeAuthInfo implements Action {
  readonly type = AuthActionTypes.CHANGE_AUTH_INFO;
  constructor(public payload: any) {}
}

export class RetriveState implements Action {
  readonly type = AuthActionTypes.RETRIVE_STATE;
}

export type All =
  | LogIn
  | LogInSuccess
  | LogInFailure
  | LogOut
  | ChangeAuthInfo
  | RetriveState ;
