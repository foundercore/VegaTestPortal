import { map } from 'rxjs/operators';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { PAGE_OPTIONS } from 'src/app/core/constants';
import { AppState } from 'src/app/state_management/_states/auth.state';
import { TestConfigService } from '../../assignments/services/test-config-service';
import { BreadcrumbNavService } from '../../layout/breadcrumb/breadcrumb-nav.service';
import {
  Metric,
  StudentReportModel,
} from 'src/app/models/reports/student-report-model';
import { FilterModel } from '../filter/filter.component';

@Component({
  selector: 'app-student-report',
  templateUrl: './student-report.component.html',
  styleUrls: ['./student-report.component.scss'],
})
export class StudentReportComponent implements OnInit {
  solutionSectionSelection;

  solutionSectionSelectedIndex = 0;

  solutionSectionArray = [];

  explanationMap = new Map();

  passageMap = new Map();

  solutionSectionWiseStats: StudentReportModel[] = [];

  solutionSectionWiseSelectedStats = new EventEmitter<StudentReportModel>();

  rankingDisplayedColumn: string[] = [
    'rank',
    'name',
    'totalMarks',
    'marksReceived',
  ];

  displayedColumns: string[] = [
    'name',
    'questions',
    'timeTaken',
    'attempt',
    'correct',
    'incorrect',
    'skipped',
    'score',
    'accuracy',
  ];
  userName: string = '';
  studentName: string = '';
  userType: string = '';
  assignmentId: string = '';

  fetchedWholeAssignmentResult;

  filterData = new EventEmitter();

  rankingDetailsResult;

  metrics;

  currentSelection = 'Section Level';

  solution = 'Solution';

  quickView = 'Charts';

  currentSolutionSelection: { filterData?: FilterModel } = {};

  public pageOptions = PAGE_OPTIONS;

  isLoading: boolean = true;

  dataSource = new MatTableDataSource<StudentReportModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  assignmentChartData: {
    type: string;
    title: string;
    config?: any;
    data: { name: string; value?: number; series?: any[] }[];
  }[] = [];

  constructor(
    public translate: TranslateService,
    private store: Store<AppState>,
    private testConfigService: TestConfigService,
    private activatedRoute: ActivatedRoute,
    public _sanitizer: DomSanitizer,
    public breadcrumbNavService: BreadcrumbNavService,
  ) {}

  ngOnInit() {
    this.store.select('appState').subscribe((data) => {
      this.userName = data?.user?.userName;
      this.studentName = data?.user?.firstName + ' ' + data?.user?.lastName;
      this.userType = data?.user?.authorities[0]?.authority;
      console.log('data', data);
    });
    this.isLoading = true;
    this.getAssignmentResults();
    this.getRankingDetails();
  }

  getAssignmentResults() {
    this.activatedRoute.params.subscribe((params) => {
      let assignmentId = params.id;
      console.log('assignmentId=>', assignmentId); // Print the parameter to the console.
      this.testConfigService
        .getStudentAssignmentResult(assignmentId, this.userName)
        .subscribe(
          (res) => {
            this.fetchedWholeAssignmentResult = res;
            this.getSectionWiseStats(this.fetchedWholeAssignmentResult);
            this.filterData.emit(this.fetchedWholeAssignmentResult.sections);
            this.solutionSectionWiseSelectedStats.emit(
              this.solutionSectionWiseStats[0]
            );
            this.fetchedWholeAssignmentResult?.sections.forEach(
              (section, i) => {
                this.solutionSectionArray.push({
                  index: i,
                  name: section.sectionName,
                });
              }
            );
            if (this.solutionSectionArray.length != 0) {
              this.solutionSectionSelection = this.solutionSectionArray[0];
              this.solutionSectionSelectedIndex = 0;
            }
            this.fetchedWholeAssignmentResult.sections.forEach((section) =>
              section.answers.forEach((answers) => {
                this.explanationMap.set(answers.questionId, true);
                this.passageMap.set(answers.questionId, true);
              })
            );
            this.breadcrumbNavService.pushOnClickCrumb({ label: res.testName });
            this.createAssignmentChartData(res.summary.metric);
            this.isLoading = false;
            this.metrics = res.summary.metric;
            this.showFilteredData(this.currentSelection);
          },
          (err) => {
            console.log('Error while fetching studentReport=>', err);
            this.isLoading = false;
          }
        );
    });
  }

  getRankingDetails() {
    this.activatedRoute.params.subscribe((params) => {
      this.testConfigService.getRankingDetails(params.id).subscribe((resp) => {
        let sorted = resp.slice().sort(function (a, b) {
          return b.marksReceived - a.marksReceived;
        });
        let tempRank = 0;
        let tempMarkRecived;
        let loginStudentIndex = -1;
        let loginStudentUserName = this.userName;
        let ranks = sorted.map(function (v, index, userName) {
          if (
            tempMarkRecived == undefined ||
            tempMarkRecived != v.marksReceived
          ) {
            tempRank++;
          }
          if (v.username == loginStudentUserName) {
            loginStudentIndex = index;
          }
          tempMarkRecived = v.marksReceived;
          v.rank = tempRank;
          return v;
        });

        if (loginStudentIndex != -1) {
          let delStudnt = ranks.splice(loginStudentIndex, 1);
          ranks = delStudnt.concat(ranks);
        }

        this.rankingDetailsResult = ranks;
      });
    });
  }

  changeSolutionFilter(filterMode?) {
    if (this.currentSolutionSelection === filterMode) {
      this.currentSolutionSelection = {};
    } else {
      this.currentSolutionSelection = filterMode;
    }
  }

  getSectionWiseStats(fetchedWholeAssignmentResult) {
    var totScore = 0,
      negativeMarks = 0,
      totalTimeInSecs = 0,
      totalQuestions = 0,
      totalCorrectQuestions = 0,
      totalAttemptedQuestions = 0,
      totalAccuracyPerc = 0,
      noOfRows = 0;

    fetchedWholeAssignmentResult.summary.sections.map((sec) => {
      var studentReportModel = new StudentReportModel();
      studentReportModel.name = sec.sectionName;
      studentReportModel.questions = sec.metric.totalQuestions;
      studentReportModel.timeTaken = sec.metric.totalTimeInSec;
      studentReportModel.attempt = sec.metric.attempted;
      studentReportModel.incorrect = sec.metric.incorrect;
      studentReportModel.skipped = sec.metric.skipped;
      studentReportModel.score = sec.metric.marksReceived;

      totScore += sec.metric.marksReceived;
      negativeMarks += sec.metric.negativeMarks;

      totalTimeInSecs += sec.metric.marksReceived;
      totalQuestions += sec.metric.totalQuestions;
      totalCorrectQuestions += sec.metric.correct;
      totalAttemptedQuestions += sec.metric.attempted;

      studentReportModel.correct = sec.metric.correct;
      studentReportModel.accuracy =
        Math.round(
          (sec.metric.correct / sec.metric.totalQuestions) * 100 * 100
        ) / 100;
      totalAccuracyPerc += studentReportModel.accuracy;
      if (studentReportModel.accuracy > 0) noOfRows++;
      this.solutionSectionWiseStats.push(studentReportModel);
    });
  }

  showFilteredData(filterMode?) {
    this.currentSelection = filterMode;
    var datas = [];
    var totScore = 0,
      negativeMarks = 0,
      totalTimeInSecs = 0,
      totalQuestions = 0,
      totalCorrectQuestions = 0,
      totalAttemptedQuestions = 0,
      totalAccuracyPerc = 0,
      noOfRows = 0;

    if (filterMode === 'Section Level') {
      this.fetchedWholeAssignmentResult.summary.sections.map((sec) => {
        var studentReportModel = new StudentReportModel();
        studentReportModel.name = sec.sectionName;
        studentReportModel.questions = sec.metric.totalQuestions;
        studentReportModel.timeTaken = sec.metric.totalTimeInSec;
        studentReportModel.attempt = sec.metric.attempted;
        studentReportModel.incorrect = sec.metric.incorrect;
        studentReportModel.skipped = sec.metric.skipped;
        studentReportModel.score = sec.metric.marksReceived;

        totScore += sec.metric.marksReceived;
        negativeMarks += sec.metric.negativeMarks;

        totalTimeInSecs += sec.metric.marksReceived;
        totalQuestions += sec.metric.totalQuestions;
        totalCorrectQuestions += sec.metric.correct;
        totalAttemptedQuestions += sec.metric.attempted;

        studentReportModel.correct = sec.metric.correct;
        studentReportModel.accuracy =
          Math.round(
            (sec.metric.correct / sec.metric.totalQuestions) * 100 * 100
          ) / 100;
        totalAccuracyPerc += studentReportModel.accuracy;
        if (studentReportModel.accuracy > 0) noOfRows++;
        datas.push(studentReportModel);
      });
      this.dataSource.data = datas;
    } else if (filterMode === 'Topic Level') {
      this.fetchedWholeAssignmentResult.summary.topics.map((sec) => {
        var studentReportModel = new StudentReportModel();
        studentReportModel.name = sec.topic;
        studentReportModel.questions = sec.metric.totalQuestions;
        studentReportModel.timeTaken = sec.metric.totalTimeInSec;
        studentReportModel.attempt = sec.metric.attempted;
        studentReportModel.incorrect = sec.metric.incorrect;
        studentReportModel.skipped = sec.metric.skipped;
        studentReportModel.score = sec.metric.marksReceived;
        studentReportModel.accuracy =
          Math.round(
            (sec.metric.correct / sec.metric.totalQuestions) * 100 * 100
          ) / 100;
        studentReportModel.correct = sec.metric.correct;

        totScore += sec.metric.marksReceived;
        negativeMarks += sec.metric.negativeMarks;
        totalTimeInSecs += sec.metric.marksReceived;
        totalQuestions += sec.metric.totalQuestions;
        totalCorrectQuestions += sec.metric.correct;
        totalAttemptedQuestions += sec.metric.attempted;
        totalAccuracyPerc += studentReportModel.accuracy;
        if (sec.metric.attempted > 0) noOfRows++;

        datas.push(studentReportModel);
      });
      this.dataSource.data = datas;
    } else if (filterMode === 'Difficulty Level') {
      this.fetchedWholeAssignmentResult.summary.difficulty.map((sec) => {
        var studentReportModel = new StudentReportModel();
        studentReportModel.name = sec.difficultyLevel;
        studentReportModel.questions = sec.metric.totalQuestions;
        studentReportModel.timeTaken = sec.metric.totalTimeInSec;
        studentReportModel.attempt = sec.metric.attempted;
        studentReportModel.incorrect = sec.metric.incorrect;
        studentReportModel.skipped = sec.metric.skipped;
        studentReportModel.score = sec.metric.marksReceived;
        studentReportModel.accuracy =
          Math.round(
            (sec.metric.correct / sec.metric.totalQuestions) * 100 * 100
          ) / 100;
        studentReportModel.correct = sec.metric.correct;

        totScore += sec.metric.marksReceived;
        negativeMarks += sec.metric.negativeMarks;
        totalTimeInSecs += sec.metric.marksReceived;
        totalQuestions += sec.metric.totalQuestions;
        totalCorrectQuestions += sec.metric.correct;
        totalAttemptedQuestions += sec.metric.attempted;
        totalAccuracyPerc += studentReportModel.accuracy;
        if (studentReportModel.accuracy > 0) noOfRows++;

        datas.push(studentReportModel);
      });
      this.dataSource.data = datas;
    } else if (filterMode === 'Ranking') {
      this.dataSource.data = this.rankingDetailsResult;
    }
  }

  rankFlag: boolean;

  onTabChanged($event) {
    if ($event.tab.textLabel === 'Ranking') {
      if (this.dataSource.data) {
        this.dataSource.data = this.rankingDetailsResult;
        this.rankFlag = true;
      } else {
        this.rankFlag = false;
      }
    }
  }

  public transform(value: string): SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(value);
  }

  getTotal(property: string) {
    return this.dataSource.data
      .map((t) => t[property])
      .reduce((acc, value) => acc + value, 0);
  }

  createAssignmentChartData(metrics: Metric) {
    this.assignmentChartData.push({
      type: 'Pie',
      title: 'Questions Statistics',
      config: {
        colorScheme: ['#fb3', '#00c851', '#ff3547'],
        view: [400, 400],
      },
      data: [
        {
          name: 'Skipped Questions',
          value: metrics?.skipped,
        },
        {
          name: 'Correct Questions',
          value: metrics?.correct,
        },
        {
          name: 'Incorrect Questions',
          value: metrics?.incorrect,
        },
      ],
    });

    this.assignmentChartData.push({
      type: 'Stacked Bar Chart',
      title: 'Marks Statistics',
      config: {
        colorScheme: ['#fb3', '#00c851', '#ff3547'],
        view: [400, 400],
      },
      data: [
        {
          name: 'Skipped Marks',
          series: [
            {
              name: 'Skipped Marks',
              value: metrics?.skippedMarks,
            },
          ],
        },
        {
          name: 'Positive Marks',
          series: [
            {
              name: 'Positive Marks',
              value: metrics?.positiveMarks,
            },
          ],
        },
        {
          name: 'Negative Marks',
          series: [
            {
              name: 'Negative Marks',
              value: metrics?.negativeMarks,
            },
          ],
        },
      ],
    });

    this.assignmentChartData.push({
      type: 'Vertical Bar Chart',
      title: 'Time Statistics',
      config: {
        colorScheme: ['#fb3', '#00c851', '#ff3547'],
        yAxisLabel: 'Time',
        xAxisLabel: '',
        showXAxisLabel: false,
        showYAxisLabel: true,
      },
      data: [
        {
          name: 'Total Skipped Time',
          value: metrics?.skippedTimeInSec,
        },
        {
          name: 'Total Correct Time',
          value: metrics?.correctTimeInSec,
        },
        {
          name: 'Total Incorrect Time',
          value: metrics?.incorrectTimeInSec,
        },
      ],
    });
  }

  toggleSolutionSection(selected) {
    this.solutionSectionSelection = selected;
    this.solutionSectionSelectedIndex = selected.index;
    this.solutionSectionWiseSelectedStats.emit(
      this.solutionSectionWiseStats[selected.index]
    );
  }

  filterSolutionData(event) {
    this.currentSolutionSelection = event;
  }

  showExplanation(i) {
    if (this.explanationMap.get(i)) {
      this.explanationMap.set(i, false);
    } else {
      this.explanationMap.set(i, true);
    }
  }

  showPassage(questionId) {
    if (this.passageMap.get(questionId)) {
      this.passageMap.set(questionId, false);
    } else {
      this.passageMap.set(questionId, true);
    }
  }
}
