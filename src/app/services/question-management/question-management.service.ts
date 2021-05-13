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

  getQuestionList(sort: string, order: string, page: number):Observable<QuestionPaginatedResponse>{
    const url = `${this.BASE_SERVICE_URL}/api/v1/question/search`;
    const searchQuestion = new SearchQuestion("0",100)
    return this.http.post<any>(url, searchQuestion);
  }

  getQuestion(questionId: string):Observable<QuestionModel>{
    const url = `${this.BASE_SERVICE_URL}/api/v1/question/${questionId}`;
    const searchQuestion = new SearchQuestion("0",100)
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
    return this.http.post<any>(url,{});
  }

  bulkDeletQuestions(questionIdlist: any[]){
    const url = `${this.BASE_SERVICE_URL}/api/v1/question/bulk-remove`;
    return this.http.post<any>(url, questionIdlist);
  }


  getQuestionType():Observable<string[]>{
    const url = `${this.BASE_SERVICE_URL}/api/v1/question/configured-question-types`;
    return this.http.post<any>(url,{});
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
}
