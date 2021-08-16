import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { Observable } from 'rxjs';
import { AssignmentRequest } from 'src/app/models/test-assignment/test-assignment-request';
@Injectable({
  providedIn: 'root'
})
export class TestAssignmentServiceService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getAssignmentListByTestId(testId:string): Observable<any> {
    const url = `${this.BASE_SERVICE_URL}/api/v1/test/assignment/by-test/${testId}/list`;
    return this.http.get<any>(url);
  }


  addAssignment(assignmentModel:AssignmentRequest): Observable<any> {
    const url = `${this.BASE_SERVICE_URL}/api/v1/test/assignment/create`;
    return this.http.post(url, assignmentModel, { responseType: 'text' });
  }

  updateAssignment(assignmentId:string, assignmentModel:AssignmentRequest): Observable<any> {
    const url = `${this.BASE_SERVICE_URL}/api/v1/test/assignment/${assignmentId}/update`;
    return this.http.post<any>(url,assignmentModel);
  }

  deleteAssignment(assignmentId:string){
    const url = `${this.BASE_SERVICE_URL}/api/v1/test/assignment/${assignmentId}/remove`;
    return this.http.delete<any>(url);
  }

  getMyAssignment(){
    const url = `${this.BASE_SERVICE_URL}/api/v1/test/assignment/my-assignments`;
    return this.http.get<any>(url);
  }



  getAssignment(assignmentId){
    const url = `${this.BASE_SERVICE_URL}/api/v1/test/assignment/${assignmentId}`;
    return this.http.get<any>(url);
  }

  getAssignmentByUsername(username:string){
    const url = `${this.BASE_SERVICE_URL}/api/v1/test/assignment/by-name/${username}/list`;
    return this.http.get<any>(url);
  }


  resetStudentAssignment(assignment_id:string,username:string){
    const url = `${this.BASE_SERVICE_URL}/api/v1/test/assignment/submission/${assignment_id}/${username}/remove`;
    return this.http.delete<any>(url);
  }
}
