import * as auth from '../_reducers/auth.reducers';


export interface AppState {
  appState: auth.State;
}

export const reducers = {
  auth: auth.AppReducer
};
