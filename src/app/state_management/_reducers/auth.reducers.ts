import { All, AuthActionTypes } from '../_actions/user.action';
import { IUserModel, UserModel } from '../../models/user/user-model';
export interface State  {
    // is a user authenticated?
  isAuthenticated: boolean;

  // if authenticated, there should be a user object
  user: IUserModel | null;

  // error message
  errorMessage: string | null;

};

export const initialState: State  = {
  isAuthenticated: false,
  user: null,
  errorMessage: null
};



export function ChangeAuthInfoState(user: any,password: string){
  sessionStorage.setItem('authInfo', btoa(user.email+':'+ password));
  return  new UserModel(user, btoa(user.email+':'+ password),user.authorities);
}

export function retriceState(state){
  if(sessionStorage.getItem('state')){
    var oldState = JSON.parse(sessionStorage.getItem('state'))
    sessionStorage.removeItem('state');
    return {
      ...state,
      user: oldState.user,
      isAuthenticated: oldState.isAuthenticated,
      };
  } else {
    return state;
  }

}

export function AppReducer(state = initialState, action: All): State  {
  switch (action.type) {
    case AuthActionTypes.LOGIN_SUCCESS: {
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        errorMessage: null
      };
    }
    case AuthActionTypes.LOGIN_FAILURE: {
      return {
        ...state,
        errorMessage: 'Incorrect email and/or password.'
      };
    }
    case AuthActionTypes.CHANGE_AUTH_INFO: {
      return {
        ...state,
        user: ChangeAuthInfoState(state.user,action.payload.password),
        isAuthenticated: true,
      };
    }
    case AuthActionTypes.RETRIVE_STATE: {
      return retriceState(state);
    }
    case AuthActionTypes.LOGOUT: {
      return {
        ...initialState,
      };
    }
    default: {
      return state;
    }
  }
}
