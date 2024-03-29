import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

import { forkJoin, merge, Observable, of as observableOf, Subject } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { finalize } from 'rxjs/operators';

import { PAGE_OPTIONS } from 'src/app/core/constants';
import { QuestionModel } from 'src/app/models/questions/question-model';
import { SearchQuestion } from 'src/app/models/questions/search-question-model';
import { QuestionManagementService } from 'src/app/services/question-management/question-management.service';
import { QuestionsViewModel } from '../../models/questionsVM';
import { SearchQuestionPaperVM } from '../../models/searchQuestionPaperVM';
//import { SearchQuestionPaperVM } from '../../models/searchQuestionPaperVM';
import { TestConfigService } from '../../services/test-config-service';
import { AssessmentEditorComponent } from '../assessment-editor/assessment-editor.component';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.css'],
})
export class QuestionslistComponent implements OnInit, AfterViewInit {
  panelOpenState: boolean = false;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  totalNumberOfRecords = 0;
  public pageOptions = PAGE_OPTIONS;
  questions: QuestionModel[];
  questions2: QuestionModel[];
  quesmodel = [];
  actualTotalNumberOfRecords = 0;
  displayedColumns: string[] = [
    'select',
    'quesName',
    'negativeMark',
    'positiveMark',
    'skipMark',
  ];
  dataSource = new MatTableDataSource<QuestionModel>();
  selection = new SelectionModel<QuestionModel>(true, []);
  //selection = new SelectionModel<QuestionModel>(true, []);
  filterGroup = new FormGroup({
    filterNameValue: new FormControl(),
    questionTypeCntrl: new FormControl(),
    subjectCntrl: new FormControl(),
    tagCntrl: new FormControl(),
    topicCntrl: new FormControl(),
    substopicCntrl: new FormControl(),
    fileNameCntrl: new FormControl(),
    sectionNameCntrl: new FormControl(),
  });

  isFilterApply = false;
  subjectList: string[] = [];
  topicList: string[] = [];
  subTopicList: string[] = [];
  tags: string[] | undefined = [];
  questionTypeList: string[] = [];
  isLoadingResults = true;
  isRateLimitReached = false;
  searchText: string = '';


  constructor(
    @Inject(MAT_DIALOG_DATA) public _data: any,
    public dialogRef: MatDialogRef<QuestionslistComponent>,
    public dialog: MatDialog,
    private testConfigService: TestConfigService,
    private toastrService: ToastrService,
    private questionService: QuestionManagementService
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

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.getQuestions();
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
    console.log('this.dataSource.data', this.dataSource.data);
  }

  // add section dialog ts here
  addSection() {
    const dialogRef = this.dialog.open(AssessmentEditorComponent, {
      maxWidth: '500px',
      width: '100%',
      height: 'auto',
    });
  }

  checkList(event: MatCheckboxChange, row) {
    let isChecked = event.checked;
    if (!isChecked) {
      // if(this.selection?.selected?.length > 0){
      let index = this.selection?.selected.findIndex(
        (x) => x.passageId == row.passageId
      );
      if (index != -1) {
        this.selection?.selected.splice(index, 1);
      }
      //}
    }
  }

  getQuestions(pageno?) {
    this.questions = [];
    let model = new SearchQuestion(
      pageno
        ? String(this.paginator.pageIndex + pageno + 1)
        : String(this.paginator.pageIndex + 1),
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction
    );

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const searchQuestion = this.createSearchObject();
          return this.testConfigService.getQuestionList(searchQuestion);
        }),
        map((data) => {
          console.log('data in map=>', data);
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.actualTotalNumberOfRecords = data.totalRecords;
          return data.questions.map((x) => {
            x.explanation_added =
              x.explanation && x.explanation.length ? 'Yes' : 'No';
            return x;
          });
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      )
      .subscribe((data) => {
        console.log(data);
        data = data?.filter(
          (q) =>
            !this._data?.selectedques?.some(
              (ques) => ques.id == q.id.questionId
            )
        );
        this.actualTotalNumberOfRecords -= this._data.selectedques.length;
        console.log('this.paginator=>', this.paginator);
        if (data.length == 0) {
          //this.dataSource.paginator = this.paginator;
          // this.paginator.nextPage();
          this.toastrService.warning(
            'All questions of this page are already added. Please switch pages.'
          );
          //return;
        }
        this.dataSource = new MatTableDataSource(data);
        console.log(
          'This.datasource=',
          this.dataSource,
          ' data saved in it=>',
          data
        );
      });
  }

  saveQuestions() {
    this.quesmodel = [];
    // let model = new Section();
    // model.durationInMinutes = this._data.section.durationInMinutes;
    // model.name = this._data.section.name;
    if (this.selection?.selected?.length == 0) {
      this.toastrService.error('Please select atleast 1 question');
      return;
    } else {
      if (
        this.selection != null &&
        this._data.testId != null &&
        this._data.section != null
      ) {
        this.selection?.selected?.forEach((element) => {
          let model = new QuestionsViewModel();
          model.id = element?.id?.questionId;
          model.negativeMark = element.negativeMark;
          model.positiveMark = element.positiveMark;
          model.skipMark = element.skipMark;
          this.quesmodel.push(model);
        });
        this.testConfigService
          .updateQuestionPaperSectionMeta(
            this.quesmodel,
            this._data.section.id,
            this._data.testId
          )
          .subscribe(
            (res: any) => {
              console.log('this.resss==', res);
              this.toastrService.success('Question updated successfully');
              this.close();
            },
            (error) => {
              if (error.status == 400) {
                this.toastrService.error(
                  'You cannot add already existing question in the same test'
                );
              } else {
                this.toastrService.error(
                  error?.error?.message
                    ? error?.error?.message
                    : error?.message,
                  'Error'
                );
              }
            }
          );
      }
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
    this.filterGroup.controls.filterNameValue.reset();
    this.filterGroup.controls.questionTypeCntrl.reset();
    this.filterGroup.controls.subjectCntrl.reset();
    this.filterGroup.controls.tagCntrl.reset();
    this.filterGroup.controls.topicCntrl.reset();
    this.filterGroup.controls.substopicCntrl.reset();
    this.filterGroup.controls.fileNameCntrl.reset();
    this.filterGroup.controls.sectionNameCntrl.reset();
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

  resetPaging(): void {
    this.paginator.pageIndex = 0;
  }

  createSearchObject() {
    const searchQuestion = new SearchQuestion(
      String(this.paginator.pageIndex + 1),
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction
    );
    this.totalNumberOfRecords = this.paginator.pageSize;

    // exlude questions which already exists in the test
    searchQuestion.testIdToBeExcluded = this._data.testId;
    // include test associated details
    searchQuestion.includeUsedTestDetails = true;
    if (this.isFilterApply) {
      if (
        this.filterGroup.controls.filterNameValue.value !== null &&
        this.filterGroup.controls.filterNameValue.value.length !== 0
      ) {
        searchQuestion.nameRegexPattern =
          this.filterGroup.controls.filterNameValue.value;
      }
      if (
        this.filterGroup.controls.questionTypeCntrl.value !== null &&
        this.filterGroup.controls.questionTypeCntrl.value.length !== 0
      ) {
        searchQuestion.type =
          this.filterGroup.controls.questionTypeCntrl.value;
      }
      if (
        this.filterGroup.controls.subjectCntrl.value !== null &&
        this.filterGroup.controls.subjectCntrl.value.length !== 0
      ) {
        searchQuestion.subject =
          this.filterGroup.controls.subjectCntrl.value;
      }
      if (
        this.filterGroup.controls.tagCntrl.value !== null &&
        this.filterGroup.controls.tagCntrl.value.length !== 0
      ) {
        searchQuestion.tags = this.filterGroup.controls.tagCntrl.value;
      }
      if (
        this.filterGroup.controls.topicCntrl.value !== null &&
        this.filterGroup.controls.topicCntrl.value.length !== 0
      ) {
        searchQuestion.topic = this.filterGroup.controls.topicCntrl.value;
      }
      if (
        this.filterGroup.controls.substopicCntrl.value !== null &&
        this.filterGroup.controls.substopicCntrl.value.length !== 0
      ) {
        searchQuestion.subTopic =
          this.filterGroup.controls.substopicCntrl.value;
      }
      if (
        this.filterGroup.controls.fileNameCntrl.value !== null &&
        this.filterGroup.controls.fileNameCntrl.value.length !== 0
      ) {
        searchQuestion.filename =
          this.filterGroup.controls.fileNameCntrl.value;
      }

      if (
        this.filterGroup.controls.sectionNameCntrl.value !== null &&
        this.filterGroup.controls.sectionNameCntrl.value.length !== 0
      ) {
        searchQuestion.migrationSectionName =
          this.filterGroup.controls.sectionNameCntrl.value;
      }
    }
    return searchQuestion;
  }

  close() {
    this.dialogRef.close();
  }
}
