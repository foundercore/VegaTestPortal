import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  loggedIn(): Promise<boolean> {
    // TODO - add user validation

    return new Promise((resolve, reject) => {
      this.http
        .get('https://basic-auth-snipextt.vercel.app/api/auth', {
          headers: {
            Authorization: `Basic ${localStorage.getItem('authInfo')}`,
          },
        })
        .subscribe({
          error: (err) => {
            reject(false);
          },
          next: (data) => resolve(true),
        });
    });
  }
}
