import { QuestionManagementService } from './../../../services/question-management/question-management.service';
import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { QuestionModel } from 'src/app/models/questions/question-model';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {SelectionModel} from '@angular/cdk/collections';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { QuestionBulkUploadDialogComponent } from '../question-bulk-upload-dialog/question-bulk-upload-dialog.component';
import { QuestionFormComponent } from '../question-form/question-form.component';
import { Router , Params, ActivatedRoute} from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-question-management',
  templateUrl: './question-management.component.html',
  styleUrls: ['./question-management.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionManagementComponent implements OnInit,AfterViewInit  {


  displayedColumns: string[] = ['select', 'name', 'description', 'subject','explanation_added','tags','actions'];

  filteredAndPagedIssues!: Observable<QuestionModel[]>;

  selection = new SelectionModel<QuestionModel>(true, []);

  totalNumberOfRecords = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatTable)
  table!: MatTable<any>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;


  constructor(
    private questionService: QuestionManagementService,
    public dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService
    ) {}


  ngOnInit(): void {

  }


  ngAfterViewInit() {

    this.filteredAndPagedIssues = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.questionService.getQuestionList(
            this.sort.active, this.sort.direction, this.paginator.pageIndex);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.totalNumberOfRecords = 100;
          return data.questions.map(x => {
            x.explanation_added = x.explanation?.length != 0 ? "Yes": "No";
            return x;
          });
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub APIQuestionManagementService has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      );
  }

  resetPaging(): void {
    this.paginator.pageIndex = 0;
  }


  performGridAction(type?: string,row?:any){
      if(type === 'upload'){
          this.openBulkUploadDialog();
      } else if (type === 'add'){
        this.router.navigate(['home/questionmanagement/add']);
      } else if(type === 'view'){

      }else if(type === 'edit'){
          this.router.navigate(['home/questionmanagement/' + row.id?.questionId + '/edit']);
      }else if(type === 'delete'){
        this.deleteQuestion(row);
      } else if(type === 'bulk_delete'){
          this.bulkDeletQuestions();
      }
  }

  applyFilter(event: Event){

  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.totalNumberOfRecords;
    return numSelected === numRows;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: QuestionModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  openBulkUploadDialog() {
    const dialogRef = this.dialog.open(QuestionBulkUploadDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  deleteQuestion(row: QuestionModel){
      this.questionService.deletQuestion(row.id?.questionId).subscribe(resp => {
          this.toastr.success("Question Delete SuccessFully");
          this.resetPaging();
      },
      error =>{
          this.toastr.error(error.error.apierror.message);
      }
      )
  }

  bulkDeletQuestions(){
    if(this.selection.selected.length == 0){
      this.toastr.error("Please select atleast one Question");
    } else {
      let questionIdlList = this.selection.selected.map(x => x.id?.questionId);
      this.questionService.bulkDeletQuestions(questionIdlList).subscribe(resp => {
        this.toastr.success("Question Delete SuccessFully");
        this.selection.clear();
        this.resetPaging();
    },error =>{
        this.toastr.error(error.error.apierror.message);
    })
    }

}
}
