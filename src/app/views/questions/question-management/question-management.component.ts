import { QuestionManagementService } from './../../../services/question-management/question-management.service';
import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { QuestionModel } from 'src/app/models/questions/question-model';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {SelectionModel} from '@angular/cdk/collections';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { QuestionBulkUploadDialogComponent } from '../question-bulk-upload-dialog/question-bulk-upload-dialog.component';
import { Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup } from '@angular/forms';
import { SearchQuestion } from 'src/app/models/questions/search-question-model';


@Component({
  selector: 'app-question-management',
  templateUrl: './question-management.component.html',
  styleUrls: ['./question-management.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionManagementComponent implements OnInit,AfterViewInit  {


  displayedColumns: string[] = ['select', 'name', 'description', 'subject','explanation_added','tags','actions'];

  filterColumns: string[] = ['Name & Description', 'Subject', 'Tags', 'Type','Topic','Sub Topic'];


  dataSource = new MatTableDataSource<QuestionModel>();

  selection = new SelectionModel<QuestionModel>(true, []);

  totalNumberOfRecords = 0;
  isLoadingResults = true;
  isRateLimitReached = false;


  filterGroup  = new FormGroup({
    filterField : new FormControl('Name & Description'),
    filterValue : new FormControl(),
  })

  filterOptions:string[] = [];

  typeOfFilter = 1;

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

    merge(this.sort.sortChange, this.paginator.page,this.filterGroup.controls['filterValue'].valueChanges)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const searchQuestion = new SearchQuestion(String(this.paginator.pageIndex + 1),this.paginator.pageSize,this.sort.active, this.sort.direction )
          if(this.filterGroup.controls['filterValue'].value && this.filterGroup.controls['filterValue'].value.length != 0){
            if(this.filterGroup.controls['filterField'].value === 'Name & Description')
                    searchQuestion.nameRegexPattern = this.filterGroup.controls['filterValue'].value;
            else  if(this.filterGroup.controls['filterField'].value === 'Subject')
                    searchQuestion.subject = this.filterGroup.controls['filterValue'].value;
            else  if(this.filterGroup.controls['filterField'].value === 'Tags')
                    searchQuestion.tags = this.filterGroup.controls['filterValue'].value;
            else  if(this.filterGroup.controls['filterField'].value === 'Type')
                    searchQuestion.type = this.filterGroup.controls['filterValue'].value;
            else  if(this.filterGroup.controls['filterField'].value === 'Topic')
                     searchQuestion.nameRegexPattern = this.filterGroup.controls['filterValue'].value;
            else  if(this.filterGroup.controls['filterField'].value === 'Sub Topic')
                     searchQuestion.nameRegexPattern = this.filterGroup.controls['filterValue'].value;

            searchQuestion.pageNumber = "1";
          }
          return this.questionService.getQuestionList(searchQuestion);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.totalNumberOfRecords = data.totalRecords;
          return data.questions.map(x => {
            x.explanation_added = x.explanation?.length != 0 ? "Yes": "No";
            return x;
          });
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource.data = data);


      this.filterGroup.controls['filterField'].valueChanges.subscribe(resp => {
            if(resp === 'Name & Description'){
              this.typeOfFilter = 1;
              this.filterOptions = [];
            }
            else  if(resp === 'Subject'){
                  this.typeOfFilter = 2;
                  this.questionService.getQuestionSubjects().subscribe(resp => this.filterOptions = resp);
            }
            else  if(resp === 'Tags'){
                  this.typeOfFilter = 3;
                  this.questionService.getQuestionTags().subscribe(resp => this.filterOptions = resp);
            }
            else  if(resp === 'Type'){
                  this.typeOfFilter = 2;
                  this.questionService.getQuestionType().subscribe(resp => this.filterOptions = resp);
            }
            else  if(resp === 'Topic'){
                  this.typeOfFilter = 2;
                  this.questionService.getQuestionTopics().subscribe(resp => this.filterOptions = resp);
            }
            else  if(resp === 'Sub Topic'){
                this.typeOfFilter = 2;
                this.questionService.getQuestionSubtopics().subscribe(resp => this.filterOptions = resp);
              }
        this.filterGroup.controls['filterValue'].reset();
      })
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

  applyFilter(event: any){
    if(event.value)
    this.filterGroup.controls['filterValue'].setValue(event.value);
    else
    this.filterGroup.controls['filterValue'].setValue(event.target.value);
  }

   /** Selects all rows if they are not all selected; otherwise clear selection. */
   masterToggle() {
    this.isAllSelected() ?
       this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
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
