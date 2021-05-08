import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }
  getUsers(): Observable<any> {
    const url = `${this.BASE_SERVICE_URL}/api/v1/users`;
    let headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa('test@demo.com:Pass@123'),
    });
    let options = { headers: headers };
    return this.http.get<any>(url, options);
  }
}
