export class SearchQuestionPaperVM {

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

  pageNumber: number;
  pageSize: number;
  sortColumn: string | 'lastUpdatedOn';
  sortOrder: string | 'asc';
  nameRegexPattern: string;
  status: string;
}
