import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {


  constructor(private http: HttpClient) {
    super();
  }

  public getToken(): string | null{
    return localStorage.getItem('authInfo');
  }


  logIn(username: string, password: string): Observable<any> {
    const url = `${this.BASE_SERVICE_URL}/login`;
    let headers = new HttpHeaders({ 'Authorization': 'Basic ' + btoa(username+':'+ password) });
    let options = { headers: headers };
    return this.http.post<any>(url, {},options);
  }
}
