import { All, AuthActionTypes } from '../_actions/user.action';
import { IUserModel } from '../../models/user/user-model';
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
    default: {
      return state;
    }
  }
}