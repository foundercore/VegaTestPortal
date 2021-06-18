export class SearchQuestionPaperVM {
  // constructor(pageNumber = 1, pageSize = 25) {
  //   this.pageNumber = pageNumber;
  //   this.pageSize = pageSize;
  // }

  constructor(
    pageNumber?: string,
    pageSizeValue?: number,
    sortColumn?: string,
    sortOrder?: string
  ) {
    this.pageNumber = Number(pageNumber);
    this.pageSize = pageSizeValue;
    this.sortColumn = sortColumn ? sortColumn : 'lastUpdatedOn';
    this.sortOrder = sortOrder;
  }
  // pageNumber: number = 1;
  // pageSize: number = 25;
  pageNumber: number;
  pageSize: number;
  sortColumn: string | 'lastUpdatedOn';
  sortOrder: string | 'asc';
  nameRegexPattern: string;
}
// import { QuestionModel } from 'src/app/models/questions/question-model';
// export class SearchQuestionPaperVM {
//   filename: string | undefined;
//   nameRegexPattern: string | undefined;
//   pageSize: number | undefined;
//   pageNumber: string | undefined;
//   questionId: string | undefined;
//   sortColumn: string | undefined;
//   sortOrder: string | undefined;
//   subject: string | undefined;
//   tags: [] | undefined;
//   type: string | undefined;
//   subTopic: string | undefined;
//   topic: string | undefined;
//   updateEndTime: string | undefined;
//   updateStartTime: string | undefined;

//   constructor(
//     pageNumber: string,
//     pageSizeValue: number,
//     sortColumn?: string,
//     sortOrder?: string
//   ) {
//     this.pageNumber = pageNumber;
//     this.pageSize = pageSizeValue;
//     this.sortColumn = sortColumn ? sortColumn : 'lastUpdatedOn';
//     this.sortOrder = sortOrder;
//   }
// }

// export interface QuestionPaginatedResponse {
//   pageSize: number | undefined;
//   paginatedRowId: string | undefined;
//   questions: QuestionModel[];
//   totalRecords: number;
// }
