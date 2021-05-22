import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from 'src/app/state_management/_states/auth.state';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {

  authInfo: string;

  constructor(private http: HttpClient, private store: Store<AppState> ) {
    super();
    this.store.select('appState').subscribe(auth => {
      if(auth?.user?.authInfo)
          this.authInfo=auth.user.authInfo;
      else
          this.authInfo = null;
    });
  }

  public getToken(): string{
    return  this.authInfo;
  }

  logIn(username: string, password: string): Observable<any> {
    const url = `${this.BASE_SERVICE_URL}/login`;
    let headers = new HttpHeaders({ 'Authorization': 'Basic ' + btoa(username+':'+ password) });
    let options = { headers: headers };
    return this.http.post<any>(url, {},options);
  }

}
