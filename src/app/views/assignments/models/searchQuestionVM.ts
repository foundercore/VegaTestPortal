export class SearchQuestionPaperVM {
  constructor(pageNumber = 1, pageSize = 25) {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
  }
  pageNumber: number = 1;
  pageSize: number = 25;
}
