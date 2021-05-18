import { StudentBatchModel } from './../../models/student-batch/student-batch-model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentBatchService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getStudentBatchList(): Observable<StudentBatchModel[]> {
    const url = `${this.BASE_SERVICE_URL}/api/v1/student/batches`;
    return this.http.get<StudentBatchModel[]>(url);
  }

  getStudentBatch(batchId:string): Observable<StudentBatchModel> {
    const url = `${this.BASE_SERVICE_URL}/api/v1/student/batch/${batchId}`;
    return this.http.get<StudentBatchModel>(url);
  }

  createStudentBatch(studentBatchObj: StudentBatchModel):Observable<any> {
    const url = `${this.BASE_SERVICE_URL}/api/v1/student/batch?name=${studentBatchObj.name}&description=${studentBatchObj.description}`;
    return this.http.post<any>(url,studentBatchObj);
  }

  removeStudentBatch(batchId:string): Observable<any> {
    const url = `${this.BASE_SERVICE_URL}/api/v1/student/batch/${batchId}/remove`;
    return this.http.delete<any>(url);
  }

  addStudentInBatch(batchId:string,emails: string[]): Observable<any> {
    const url = `${this.BASE_SERVICE_URL}/api/v1/student/batch/${batchId}/add-students`;
    return this.http.post<any>(url,emails);
  }

  removeStudentFromBatch(batchId:string,emails: string[]): Observable<any> {
    const url = `${this.BASE_SERVICE_URL}/api/v1/student/batch/${batchId}/remove-students`;
    return this.http.post<any>(url,emails);
  }
}
