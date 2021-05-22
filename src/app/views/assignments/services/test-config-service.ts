import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TestVM } from "../models/postTestVM";
import { Observable } from "rxjs";
import { SearchQuestionPaperVM } from "../models/searchQuestionVM";
import { BaseService } from "src/app/services/base.service";
import { TestConfigurationVM } from "../models/test-configuration";
import { Section } from "../models/sections";
import { QuestionsViewModel } from "../models/questionsVM";

@Injectable({
    providedIn: "root",
})
export class TestConfigService extends BaseService{
   headers : any;
    constructor(private http: HttpClient) {
        super();
        this.headers = new  HttpHeaders().set("X-CustomHttpHeader", "CUSTOM_VALUE");
     }

    getQuestionPaper(testId : string = ""): Observable<any> {
        const Url = `${this.BASE_SERVICE_URL}/api/v1/test/config/${testId}`;
        return this.http.get<any>(Url, this.headers);
    }

    deleteQuestionPaper(testId : string = ""): Observable<any> {
        const Url =  `${this.BASE_SERVICE_URL}/api/v1/test/config/${testId}/remove`;
        return this.http.delete<any>(Url,this.headers);
    }

    createQuestionPaper(model: TestVM): Observable<any> {
        const Url =  `${this.BASE_SERVICE_URL}/api/v1/test/config`;
        return this.http.post<any>(Url, model,this.headers)
    }
  
    getAllQuestionPaper(model: SearchQuestionPaperVM): Observable<any> {
        const Url =  `${this.BASE_SERVICE_URL}/api/v1/test/config/search`;
        return this.http.post<any>(Url, model,this.headers)
    }

    getQuestionList(model:SearchQuestionPaperVM):Observable<any>{
        const url = `${this.BASE_SERVICE_URL}/api/v1/question/search`;
        return this.http.post<any>(url, model,this.headers);
    }

    
    TestConfiguration(model:TestConfigurationVM):Observable<any>{
        const url =`${this.BASE_SERVICE_URL}/api/v1/test/config/${model.testId}/update-control-params`;
        return this.http.post<any>(url, model,this.headers);
    }

    addSection(model: Section): Observable<any> {
        const Url =  `${this.BASE_SERVICE_URL}/api/v1/test/config/${model.testId}/section/add`;
        return this.http.post<any>(Url, model,this.headers)
    }

    updateQuestionPaperSectionMeta(model: QuestionsViewModel[], sectionId : string="",testId: string = "" ): Observable<any> {
        const Url =  `${this.BASE_SERVICE_URL}/api/v1/test/config/${testId}/section/${sectionId}/question/add`;
        return this.http.post<any>(Url, model,this.headers)
    }

    removesection(testId : string = "" , sectionId : string = ""): Observable<any> {
        const Url =  `${this.BASE_SERVICE_URL}/api/v1/test/config/${testId}/section/${sectionId}/remove`;
        return this.http.delete<any>(Url,this.headers);
    }

}
