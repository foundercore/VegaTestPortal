import { QuestionMigrateUploadDialogComponent } from './../question-migrate-upload-dialog/question-migrate-upload-dialog.component';
import { QuestionManagementService } from './../../../services/question-management/question-management.service';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { QuestionModel } from 'src/app/models/questions/question-model';
import { forkJoin, merge, Observable, of as observableOf, Subject } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { QuestionBulkUploadDialogComponent } from '../question-bulk-upload-dialog/question-bulk-upload-dialog.component';
import { QuestionFormComponent } from '../question-form/question-form.component';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup } from '@angular/forms';
import { SearchQuestion } from 'src/app/models/questions/search-question-model';
import { PAGE_OPTIONS } from 'src/app/core/constants';
import { TranslateService } from '@ngx-translate/core';
import { DialogConformationComponent } from 'src/app/shared/components/dialog-conformation/dialog-conformation.component';

@Component({
  selector: 'app-question-management',
  templateUrl: './question-management.component.html',
  styleUrls: ['./question-management.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionManagementComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'select',
    'name',
    'fileName',
    'explanation_added',
    'tags',
    'actions',
  ];

  dataSource = new MatTableDataSource<QuestionModel>();

  selection = new SelectionModel<QuestionModel>(true, []);

  totalNumberOfRecords = 0;
  actualTotalNumberOfRecords = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  public pageOptions = PAGE_OPTIONS;

  filterGroup = new FormGroup({
    filterNameValue: new FormControl(),
    questionTypeCntrl: new FormControl(),
    subjectCntrl: new FormControl(),
    tagCntrl: new FormControl(),
    topicCntrl: new FormControl(),
    substopicCntrl: new FormControl(),
    fileNameCntrl: new FormControl(),
  });

  isFilterApply = false;

  subjectList: string[] = [];
  topicList: string[] = [];
  subTopicList: string[] = [];
  tags: string[] | undefined = [];
  questionTypeList: string[] = [];

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
    public translate: TranslateService,
    private toastr: ToastrService
  ) {
    forkJoin([
      this.questionService.getQuestionType(),
      this.questionService.getQuestionTags(),
      this.questionService.getQuestionSubjects(),
      this.questionService.getQuestionTopics(),
      this.questionService.getQuestionSubtopics(),
    ]).subscribe((results) => {
      this.questionTypeList = results[0];
      this.tags = results[1];
      this.subjectList = results[2];
      this.topicList = results[3];
      this.subTopicList = results[4];
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const searchQuestion = this.createSearchObject();
          return this.questionService.getQuestionList(searchQuestion);
        }),
        map((data) => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.actualTotalNumberOfRecords = data.totalRecords;
          return data.questions.map((x) => {
            x.explanation_added = x.explanation?.length != 0 ? 'Yes' : 'No';
            return x;
          });
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      )
      .subscribe((data) => (this.dataSource.data = data));
  }

  resetPaging(): void {
    this.paginator.pageIndex = 0;
  }

  performGridAction(type?: string, row?: any) {
    if (type === 'upload') {
      this.openBulkUploadDialog();
    } else if (type === 'add') {
      this.router.navigate(['home/questionmanagement/add']);
    } else if (type === 'view') {
      this.router.navigate([
        'home/questionmanagement/' + row.id?.questionId + '/view',
      ]);
    } else if (type === 'edit') {
      this.router.navigate([
        'home/questionmanagement/' + row.id?.questionId + '/edit',
      ]);
    } else if (type === 'delete') {
      this.deleteQuestion(row);
    } else if (type === 'bulk_delete') {
      this.bulkDeletQuestions();
    } else if (type === 'migrate') {
      this.openMigrateUploadDialog();
    }
  }

  applyFilter() {
    this.isFilterApply = true;
    this.isLoadingResults = true;
    this.resetPaging();
    const searchQuestion = this.createSearchObject();
    this.refreshQuestionData(searchQuestion);
    this.isLoadingResults = false;
    this.isRateLimitReached = false;
  }

  resetFilter() {
    this.filterGroup.controls['filterNameValue'].reset();
    this.filterGroup.controls['questionTypeCntrl'].reset();
    this.filterGroup.controls['subjectCntrl'].reset();
    this.filterGroup.controls['tagCntrl'].reset();
    this.filterGroup.controls['topicCntrl'].reset();
    this.filterGroup.controls['substopicCntrl'].reset();
    this.filterGroup.controls['fileNameCntrl'].reset();
    this.isFilterApply = false;
    this.resetPaging();
    const searchQuestion = this.createSearchObject();
    this.refreshQuestionData(searchQuestion);
  }

  refreshQuestionData(searchQuestion: SearchQuestion) {
    this.questionService.getQuestionList(searchQuestion).subscribe(
      (data) => {
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.totalNumberOfRecords = data.totalRecords;
        this.actualTotalNumberOfRecords = data.totalRecords;
        data.questions.map((x) => {
          x.explanation_added = x.explanation?.length != 0 ? 'Yes' : 'No';
          return x;
        });
        this.dataSource.data = data.questions;
      },
      (error) => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
      }
    );
  }

  createSearchObject() {
    const searchQuestion = new SearchQuestion(
      String(this.paginator.pageIndex + 1),
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction
    );
    if (this.isFilterApply) {
      if (
        this.filterGroup.controls['filterNameValue'].value !== null &&
        this.filterGroup.controls['filterNameValue'].value.length !== 0
      )
        searchQuestion.nameRegexPattern =
          this.filterGroup.controls['filterNameValue'].value;
      else if (
        this.filterGroup.controls['questionTypeCntrl'].value !== null &&
        this.filterGroup.controls['questionTypeCntrl'].value.length !== 0
      )
        searchQuestion.type =
          this.filterGroup.controls['questionTypeCntrl'].value;
      else if (
        this.filterGroup.controls['subjectCntrl'].value !== null &&
        this.filterGroup.controls['subjectCntrl'].value.length !== 0
      )
        searchQuestion.subject =
          this.filterGroup.controls['subjectCntrl'].value;
      else if (
        this.filterGroup.controls['tagCntrl'].value !== null &&
        this.filterGroup.controls['tagCntrl'].value.length !== 0
      )
        searchQuestion.tags = this.filterGroup.controls['tagCntrl'].value;
      else if (
        this.filterGroup.controls['topicCntrl'].value !== null &&
        this.filterGroup.controls['topicCntrl'].value.length !== 0
      )
        searchQuestion.topic = this.filterGroup.controls['topicCntrl'].value;
      else if (
        this.filterGroup.controls['substopicCntrl'].value !== null &&
        this.filterGroup.controls['substopicCntrl'].value.length !== 0
      )
        searchQuestion.subTopic =
          this.filterGroup.controls['substopicCntrl'].value;
      else if (
        this.filterGroup.controls['fileNameCntrl'].value !== null &&
        this.filterGroup.controls['fileNameCntrl'].value.length !== 0
      )
        searchQuestion.filename =
          this.filterGroup.controls['fileNameCntrl'].value;
    }

    return searchQuestion;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id
    }`;
  }

  openBulkUploadDialog() {
    const dialogRef = this.dialog.open(QuestionBulkUploadDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      this.resetFilter();
    });
  }

  openMigrateUploadDialog() {
    const dialogRef = this.dialog.open(QuestionMigrateUploadDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {});
  }

  deleteQuestion(row: QuestionModel) {
    const dialogRef = this.dialog.open(DialogConformationComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'delete') {
        this.questionService.deletQuestion(row.id?.questionId).subscribe(
          (resp) => {
            this.toastr.success('Question Delete SuccessFully');
            this.resetFilter();
          },
          (error) => {
            this.toastr.error(error.error.apierror.message);
          }
        );
      }
    });
  }

  bulkDeletQuestions() {
    if (this.selection.selected.length == 0) {
      this.toastr.error('Please select atleast one Question');
    } else {
      const dialogRef = this.dialog.open(DialogConformationComponent, {
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result == 'delete') {
          let questionIdlList = this.selection.selected.map(
            (x) => x.id?.questionId
          );
          this.questionService.bulkDeletQuestions(questionIdlList).subscribe(
            (resp) => {
              this.toastr.success('Question Delete SuccessFully');
              this.selection.clear();
              this.resetFilter();
            },
            (error) => {
              this.toastr.error(error.error.apierror.message);
            }
          );
        }
      });
    }
  }
}
