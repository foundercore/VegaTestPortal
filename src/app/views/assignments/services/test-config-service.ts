import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { TestVM } from '../models/postTestVM';
import { Observable } from 'rxjs';
import { SearchQuestionPaperVM } from '../models/searchQuestionPaperVM';
import { BaseService } from 'src/app/services/base.service';
import { TestConfigurationVM } from '../models/test-configuration';
import { Section } from '../models/sections';
import { QuestionsViewModel } from '../models/questionsVM';
import { QuestionMarkedForReviewModel } from '../models/questionMarkedForReview';
import { EditTestMetaData } from '../models/editTestMetaData';
import { SearchQuestion } from 'src/app/models/questions/search-question-model';

@Injectable({
  providedIn: 'root',
})
export class TestConfigService extends BaseService {
  headers: any;
  constructor(private http: HttpClient) {
    super();
    this.headers = new HttpHeaders().set('X-CustomHttpHeader', 'CUSTOM_VALUE');
  }

  getQuestionPaper(testId: string = ''): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/config/${testId}`;
    return this.http.get<any>(Url, this.headers);
  }

  getStudentAssignmentResult(assignment_id, username): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/assignment/submission/${assignment_id}/${username}/view-assignment-result`;
    return this.http.get<any>(Url, this.headers);
  }

  deleteQuestionPaper(testId: string = ''): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/config/${testId}/remove`;
    return this.http.delete<any>(Url, this.headers);
  }

  createQuestionPaper(model: TestVM): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/config`;
    return this.http.post<any>(Url, model, this.headers);
  }

  getAllQuestionPaper(model: SearchQuestionPaperVM): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/config/search`;
    return this.http.post<any>(Url, model, this.headers);
  }

   getQuestionPaperType (): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/config/types/all`;
    return this.http.get<any>(Url, this.headers);
  }

  getPendingVerficationTest(): Observable<any>{
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/config/pending-verification`;
    return this.http.get<any>(Url);
  }

  getRankingDetails(assignmentid: string){
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/report/submission/${assignmentid}/students-overall-ranking`;
    return this.http.get<any>(Url);
  }

  getQuestionList(model: SearchQuestion): Observable<any> {
    const url = `${this.BASE_SERVICE_URL}/api/v1/question/search`;
    return this.http.post<any>(url, model, this.headers);
  }

  saveTestConfiguration(model: any,testId: string): Observable<any> {
    const url = `${this.BASE_SERVICE_URL}/api/v1/test/config/${testId}/update-control-params`;
    return this.http.post<any>(url, model, this.headers);
  }


  savePercentileFile(file: any,paperId: string): Observable<any> {
    const fd = new FormData();
    fd.append('file', file?.data);
    const url = `${this.BASE_SERVICE_URL}/api/v1/test/config/update-percentile-scorecard?paperId=${paperId}`;

    const req = new HttpRequest('POST', url, fd, {
      reportProgress: true,
    });
    return this.http.request(req);
  }


  saveInstituteAnalysisFile(file: any,paperId: string): Observable<any> {
    const fd = new FormData();
    fd.append('file', file?.data);
    const url = `${this.BASE_SERVICE_URL}/api/v1/test/config/update-institute-analysis-file?paperId=${paperId}`;

    const req = new HttpRequest('POST', url, fd, {
      reportProgress: true,
    });
    return this.http.request(req);
  }

  addSection(model: Section): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/config/${model.testId}/section/add`;
    return this.http.post<any>(Url, model, this.headers);
  }

  editSection(
    test_id: string,
    section_id: string,
    model: Section
  ): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/config/${test_id}/section/${section_id}/update-metadata`;
    return this.http.post<any>(Url, model, this.headers);
  }

  updateTestMetaData(
    test_id: string,
    model: EditTestMetaData
  ): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/config/${test_id}/update-metadata`;
    return this.http.post<any>(Url, model, this.headers);
  }

  deleteQuestionFromSection(
    test_id: string,
    section_id: string,
    model
  ): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/config/${test_id}/section/${section_id}/question/remove`;
    return this.http.post<any>(Url, model, this.headers);
  }

  updateQuestionPaperSectionMeta(
    model: QuestionsViewModel[],
    sectionId: string = '',
    testId: string = ''
  ): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/config/${testId}/section/${sectionId}/question/add`;
    return this.http.post<any>(Url, model, this.headers);
  }

  removesection(testId: string = '', sectionId: string = ''): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/config/${testId}/section/${sectionId}/remove`;
    return this.http.delete<any>(Url, this.headers);
  }

  getQuestionbyQuestionId(questionId: string = ''): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/question/${questionId}`;
    return this.http.get<any>(Url, this.headers);
  }

  setQuestionAsMarkedForReview(
    assignment_id: string,
    body: QuestionMarkedForReviewModel
  ): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/assignment/submission/${assignment_id}/mark-for-review`;
    return this.http.post<any>(Url, body);
  }

  getSudentSubmissionState(
    assignment_id: string,
    userName: string
  ): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/assignment/submission/${assignment_id}/${userName}/submission-state`;
    return this.http.get<any>(Url);
  }


  saveandNextAnswers(
    assignment_id: string,
    body: QuestionMarkedForReviewModel
  ): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/assignment/submission/${assignment_id}/save-answer`;
    return this.http.post<any>(Url, body);
  }

  saveandExit(assignmentId: string = ''): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/assignment/submission/${assignmentId}/submit`;
    return this.http.post<any>(Url, assignmentId, this.headers);
  }

  clearQuestionResponse(
    assignment_id: string,
    body: QuestionMarkedForReviewModel
  ): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/assignment/submission/${assignment_id}/clear-answer`;
    return this.http.post<any>(Url, body);
  }

  initiateVerification(testId: string = ''): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/config/${testId}/initiate-verification`;
    return this.http.post<any>(Url, testId, this.headers);
  }

  verify(testId: string = ''): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/config/${testId}/verify`;
    return this.http.post<any>(Url, testId, this.headers);
  }

  publish(testId: string = ''): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/config/${testId}/publish`;
    return this.http.post<any>(Url, testId, this.headers);
  }

  archive(testId: string = ''): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/config/${testId}/archive`;
    return this.http.post<any>(Url, testId, this.headers);
  }

  rejectionVerification(testId: string = '', body: any): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/config/${testId}/reject-verification`;
    return this.http.post<any>(Url, body);
  }

  updateQuestionPaper(model: TestVM): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/config/${model.testId}/update-metadata`;
    return this.http.post<any>(Url, model, this.headers);
  }

  updateQuestionSequence(test_id:string,section_id:string,questionList:any[]): Observable<any>{
    const url = `${this.BASE_SERVICE_URL}/api/v1/test/config/${test_id}/section/${section_id}/question/update`;
    questionList.map((x,index) => x.sequenceNumber = index);
    return this.http.post<any>(url, questionList, this.headers);
  }

  getStudentTestAnalysis(test_id: string,analysisObj){
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/report/${test_id}/students-test-analysis`;
    return this.http.post<any>(Url,analysisObj,this.headers);
  }

  getQuestionPaperLinkedQuestions( test_id: string ): Observable<any> {
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/config/${test_id}/linked-questions`;
    return this.http.get<any>(Url);
  }

  getNmatSectionNamelist(){
    const Url = `${this.BASE_SERVICE_URL}/api/v1/test/config/nmat/sectionname`;
    return this.http.get<any>(Url,this.headers);
  }

}
