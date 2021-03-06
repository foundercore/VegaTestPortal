import { IUserCreateRequestModel, IUserUpdateRequestModel } from './../../models/user/user-model';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUserResponseModel } from 'src/app/models/user/user-model';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getUserList(): Observable<IUserResponseModel[]> {
    const url = `${this.BASE_SERVICE_URL}/api/v1/users`;
    return this.http.get<any>(url);
  }

  getUser(userName: number):Observable<IUserResponseModel> {
    const url = `${this.BASE_SERVICE_URL}/api/v1/users/${userName}`;
    return this.http.get<any>(url);
  }

  deleteUser(userName: string): Observable<any> {
    const url = `${this.BASE_SERVICE_URL}/api/v1/users/${userName}`;
    return this.http.delete<any>(url);
  }

  createUsers(userobj: IUserCreateRequestModel): Observable<any> {
    const url = `${this.BASE_SERVICE_URL}/api/v1/users`;
    return this.http.post<any>(url,userobj);
  }

  updateUsers(userobj: IUserUpdateRequestModel,userName: string): Observable<any> {
    const url = `${this.BASE_SERVICE_URL}/api/v1/users/${userName}`;
    return this.http.put<any>(url,userobj);
  }

  getRoleList(): Observable<string[]> {
    const url = `${this.BASE_SERVICE_URL}/api/v1/users/app-configured-roles`;
    return this.http.get<any>(url);
  }

  bulkCreateUser(file: any){
    const fd = new FormData();
    fd.append('file', file!.data);
    const url = `${this.BASE_SERVICE_URL}/api/v1/users/bulk-upload`;

    const req = new HttpRequest('POST', url, fd, {
      reportProgress: true,
    });

     return this.http.request(req);
  }

  bulkDeleteUser(userNameIdList: any[]){
    const url = `${this.BASE_SERVICE_URL}/api/v1/users/bulk-remove`;
    return this.http.post<any>(url, userNameIdList);
  }

  changePassword(newPassword: string){
    const url = `${this.BASE_SERVICE_URL}/api/v1/users/my/password`;
    return this.http.put<any>(url,newPassword);
  }

  getProfile(){
    const url = `${this.BASE_SERVICE_URL}/api/v1/users/my/profile`;
    return this.http.get<any>(url);
  }

}
