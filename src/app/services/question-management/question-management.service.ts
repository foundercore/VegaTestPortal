import { Observable } from 'rxjs';
import { QuestionPaginatedResponse, SearchQuestion } from './../../models/questions/search-question-model';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { QuestionModel } from 'src/app/models/questions/question-model';

@Injectable({
  providedIn: 'root'
})
export class QuestionManagementService  extends BaseService {

  constructor(private http: HttpClient) {
      super();
  }

  getQuestionList(searchQuestion:SearchQuestion):Observable<QuestionPaginatedResponse>{
    const url = `${this.BASE_SERVICE_URL}/api/v1/question/search`;
    return this.http.post<any>(url, searchQuestion);
  }

  getQuestion(questionId: string):Observable<QuestionModel>{
    const url = `${this.BASE_SERVICE_URL}/api/v1/question/${questionId}`;
    return this.http.get<any>(url);
  }

  createQuestion(question: QuestionModel):Observable<QuestionModel[]>{
    const url = `${this.BASE_SERVICE_URL}/api/v1/question`;
    return this.http.post<any>(url, question);
  }


  updateQuestion(question: QuestionModel):Observable<QuestionModel[]>{
    const url = `${this.BASE_SERVICE_URL}/api/v1/question/${question.id?.questionId}/update`;
    return this.http.post<any>(url, question);
  }

  deletQuestion(questionId: string | undefined){
    const url = `${this.BASE_SERVICE_URL}/api/v1/question/${questionId}/remove`;
    return this.http.delete<any>(url);
  }

  bulkDeletQuestions(questionIdlist: any[]){
    const url = `${this.BASE_SERVICE_URL}/api/v1/question/bulk-remove`;
    return this.http.post<any>(url, questionIdlist);
  }

  bulkUploadQuestion(file: any){
    const fd = new FormData();
    fd.append('file', file!.data);
    const url = `${this.BASE_SERVICE_URL}/api/v1/question/bulk-upload`;

    const req = new HttpRequest('POST', url, fd, {
      reportProgress: true,
    });

     return this.http.request(req);
  }

  migrateQuestion(file: any, removeHtmlContent: boolean){
    const fd = new FormData();
    fd.append('file', file!.data);
    const url = `${this.BASE_SERVICE_URL}/api/v1/migration/question?removeHtmlContent=${removeHtmlContent}`;

    const req = new HttpRequest('POST', url, fd, {
      reportProgress: true,
      responseType: 'blob'
    });

     return this.http.request(req);
  }

  getQuestionTags():Observable<string[]>{
    const url = `${this.BASE_SERVICE_URL}/api/v1/question/tags`;
    return this.http.get<any>(url);
  }

  getQuestionType():Observable<string[]>{
    const url = `${this.BASE_SERVICE_URL}/api/v1/question/types`;
    return this.http.get<any>(url);
  }

  getQuestionSubjects():Observable<string[]>{
    const url = `${this.BASE_SERVICE_URL}/api/v1/question/subjects`;
    return this.http.get<any>(url);
  }

  getQuestionTopics():Observable<string[]>{
    const url = `${this.BASE_SERVICE_URL}/api/v1/question/topics`;
    return this.http.get<any>(url);
  }

  getQuestionSubtopics():Observable<string[]>{
    const url = `${this.BASE_SERVICE_URL}/api/v1/question/sub-topics`;
    return this.http.get<any>(url);
  }

}
