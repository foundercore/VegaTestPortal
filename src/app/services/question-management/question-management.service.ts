import { Observable } from 'rxjs';
import { SearchQuestion } from './../../models/questions/search-question-model';
import { HttpClient } from '@angular/common/http';
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

  getQuestionList(sort: string, order: string, page: number):Observable<QuestionModel[]>{
    const url = `${this.BASE_SERVICE_URL}/api/v1/question/search`;
    const searchQuestion = new SearchQuestion("100",0)
    return this.http.post<any>(url, searchQuestion);
  }

}
