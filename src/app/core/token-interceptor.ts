import { AuthService } from 'src/app/services/authentication/auth.service';
import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.authService.getToken();
    if(token !== null && token !== undefined){
      request = request.clone({
        setHeaders: {
          'Authorization': `Basic ${token}`,
          //'Content-Type': 'application/json'
        }
      });
    }
    return next.handle(request);
  }
}
