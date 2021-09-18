import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { QuestionModel } from 'src/app/models/questions/question-model';
import { AppState } from 'src/app/state_management/_states/auth.state';
import { EditTestMetaData } from 'src/app/views/assignments/models/editTestMetaData';
import { Section } from 'src/app/views/assignments/models/sections';
import { TestConfigurationVM } from 'src/app/views/assignments/models/test-configuration';
import { TestConfigService } from 'src/app/views/assignments/services/test-config-service';
import { BreadcrumbNavService } from 'src/app/views/layout/breadcrumb/breadcrumb-nav.service';
import { interval, forkJoin, of, Observable, combineLatest } from 'rxjs';
import { TestAnalysisQuestionPreviewComponent } from '../test-analysis-question-preview/test-analysis-question-preview.component';
import { TestAnalysisInstitutelistDialogComponent } from '../test-analysis-institutelist-dialog/test-analysis-institutelist-dialog.component';

@Component({
  selector: 'app-test-analysis-grid',
  templateUrl: './test-analysis-grid.component.html',
  styleUrls: ['./test-analysis-grid.component.css'],
})
export class TestAnalysisGridComponent implements OnInit {

  modelsections: any[] = [];
  summarySections : any  = {};
  totalQuestionListObj : any  = {};
  testResultObj : any = {};
  testId: string = '';
  controlparms: TestConfigurationVM;

  selectionList = [];

  sectionId: string = '';
  searchText: string = '';
  quest: any;
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  actualTotalNumberOfRecords: any;
  remarks: string = '';
  breadcrumModified: boolean;
  filter = '';
  userName: string = '';
  studentName: string = '';
  userType: string = '';
  assignmentId: string = '';

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private testConfigService: TestConfigService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumbNavService: BreadcrumbNavService,
    private changeDetectorRef :ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.activatedRoute.params,
      this.store.select('appState')
    ]).subscribe((params) => {
      this.testId = params[0].test_id;
      this.assignmentId = params[0].assignment_id;
      this.userName = params[1]?.user?.userName;
      this.studentName = params[1]?.user?.firstName + ' ' + params[1]?.user?.lastName;
      this.userType = params[1]?.user?.authorities[0]?.authority;
      forkJoin([
        this.testConfigService.getStudentAssignmentResult(this.assignmentId, this.userName),
        this.testConfigService.getQuestionPaper(this.testId)
      ]).subscribe(resp => {
          console.log(resp);
          this.controlparms = resp[1]?.controlParam;
          this.testResultObj = resp[0]?.summary.metric;
          this.modelsections = resp[0]?.sections;
          resp[0]?.summary.sections.forEach(section => {
            this.summarySections[section.sectionId] = section.metric;
            this.selectionList[section.sectionId] = new SelectionModel<QuestionModel>(true, []);
          });
          console.log(this.summarySections)
          this.modelsections.forEach(section => {
            this.getSortedQuestions(section.answers);
          });
          resp[1]?.sections.forEach(section => {
            section.questions.forEach(question => {
              this.totalQuestionListObj[question.id] = question;
            });
          });
      })
    });


  }

  ngAfterViewInit(): void {


  }

  getSortedQuestions(questions: any[]) {
    if (questions && questions.length > 0) {
      questions.sort((a, b) => {
        if (a.sequenceNumber == 0 && b.sequenceNumber == 0 ) {
          const passage1 = a.passageContent ? a.passageContent : '';

          const passage2 = b.passageContent ? b.passageContent : '';

          const passageName1 = passage1 + (a.name ? a.name : '');
          const passageName2 = passage2 + (b.name ? b.name : '');
          return (passageName1 < passageName2 ? -1 : (passageName1 > passageName2 ? 1 : 0));
        } else {
          return a.sequenceNumber - b.sequenceNumber;

        }
      });
    }
    return questions;
  }

  previewQuestion(question){
    const dialogRef = this.dialog.open(TestAnalysisQuestionPreviewComponent,{
      data: {
        questionId: question.questionId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  findInstitute(){
    let reqObj = {
      sectionLevelMark:{

      },
      testId:"",
      testMark:0
    }
    let totalTestMark = 0;
    for (let [key, value] of Object.entries(this.selectionList)) {
      let analysisMark = this.summarySections[key].marksReceived;
      value.selected.forEach(question => {
        analysisMark += this.totalQuestionListObj[question.questionId].positiveMark + Math.abs(this.totalQuestionListObj[question.questionId].negativeMark);
      });
      reqObj.sectionLevelMark[`${key}`] = analysisMark;
      totalTestMark += analysisMark;
    }
    reqObj.testId = this.testId;
    reqObj.testMark = totalTestMark;
    console.log(reqObj);
    this.testConfigService.getStudentTestAnalysis(this.testId,reqObj).subscribe(resp => {
      this.dialog.open(TestAnalysisInstitutelistDialogComponent, {
        data: {
          institute : resp,
          markReceived:totalTestMark,
          totalTestMark:this.testResultObj.totalMarks
        }
      });
    })
  }
}



