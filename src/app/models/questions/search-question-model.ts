import { QuestionModel } from 'src/app/models/questions/question-model';
export class SearchQuestion {
  filename: string | undefined;
  nameRegexPattern: string | undefined;
  pageSize: number | undefined;
  paginatedRowId: string | undefined;
  questionId: string | undefined;
  sortColumn: string | undefined;
  sortOrder: string | undefined;
  subject: string | undefined;
  tags: [] | undefined;
  type: string| undefined;
  updateEndTime: string | undefined;
  updateStartTime: string | undefined;

  constructor(paginatedRowIdValue:string,pageSizeValue:number) {
    //this.paginatedRowId = paginatedRowIdValue;
    this.pageSize = pageSizeValue;
  }
}





export interface QuestionPaginatedResponse {
  pageSize: number | undefined;
  paginatedRowId: string | undefined;
  questions: QuestionModel[]
  totalRecords: number | undefined;
}
