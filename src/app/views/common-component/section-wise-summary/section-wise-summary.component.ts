import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-section-wise-summary',
  templateUrl: './section-wise-summary.component.html',
  styleUrls: ['./section-wise-summary.component.scss'],
})
export class SectionWiseSummaryComponent implements OnInit {
  isPercentile = false;

  sectoionLevelDataSource = [];

  difficultyDataSource = [];

  sectionDifficultyDataSource = [];

  timeAnalysisDataSource = [];

  sectionLevelSummaryDisplayedColumns: string[] = [
    'name',
    'correct',
    'incorrect',
    'skipped',
    'marks',
    'accuracy',
    'avgtime',
    'percentile',
  ];

  difficultySummaryDisplayedColumns: string[] = [
    'level',
    'correctCount',
    'correctAvgTime',
    'incorrectCount',
    'incorrectAvgTime',
    'skippedCount',
    'skippedAvgTime',
    'marks',
  ];

  sectionWiseDifficultyCol: string[] = [
    'name',
    'easyCrctCount',
    'easyIncrctCount',
    'easySkippedCount',
    'mediumCorrectCount',
    'mediumIncorrectCount',
    'mediumSkippedCount',
    'hardCorrectCount',
    'hardIncorrectCount',
    'hardSkippedCount',
  ];

  timeAnalysisColumn: string[] = [
    'name',
    'easyCorrecttime',
    'easyIncorrectTime',
    'easySkippedTime',
    'mediumCorrectTime',
    'mediumIncorrectTime',
    'mediumSkippedTime',
    'hardCorrectTime',
    'hardIncorrectTime',
    'hardSkippedTime',
  ];

  averageTime: number;

  @Input() summaryData = new EventEmitter();

  @Input() difficultyWiseStats = new EventEmitter();

  @Input() timeAnalysisStats = new EventEmitter();

  @Input() type = '';

  @ViewChild('sectionTable') sectionTable: MatTable<any>;

  @ViewChild('diffiultylevelTable') diffiultylevelTable: MatTable<any>;

  constructor() {}

  ngOnInit() {
    this.difficultyWiseStats.subscribe((resp) => {
      this.sectionDifficultyDataSource = resp;
    });

    this.timeAnalysisStats.subscribe((resp) => {
      this.timeAnalysisDataSource = resp;
    });

    this.summaryData.subscribe((resp) => {
      if (resp.controlParam) {
        this.isPercentile = resp.controlParam.percentile;
      }

      if (!this.isPercentile) {
        this.sectionLevelSummaryDisplayedColumns.pop();
      }

      resp.sections.forEach((section) => {
        this.sectoionLevelDataSource.push({
          name: section.sectionName,
          correct: section.metric.correct,
          incorrect: section.metric.incorrect,
          skipped: section.metric.skipped,
          marks: section.metric.marksReceived,
          time: section.metric.totalTimeInSec,
          percentileScore: section.metric.percentileScore,
        });
      });

      this.averageTime = Math.round(
        resp.metric.totalTimeInSec / resp.sections.length
      );

      this.sectionTable.renderRows();

      resp.difficulty.forEach((level) => {
        this.difficultyDataSource.push({
          level: level.difficultyLevel,
          correctCount: level.metric.correct,
          correctAvgTime:
            level.metric.correct != 0
              ? Math.round(level.metric.correctTimeInSec / level.metric.correct)
              : 0,
          incorrectCount: level.metric.incorrect,
          incorrectAvgTime:
            level.metric.incorrect != 0
              ? Math.round(
                  level.metric.incorrectTimeInSec / level.metric.incorrect
                )
              : 0,
          skippedCount: level.metric.skipped,
          skippedAvgTime:
            level.metric.skipped != 0
              ? Math.round(level.metric.skippedTimeInSec / level.metric.skipped)
              : 0,
          marks: level.metric.marksReceived,
          totalQuestions: level.metric.totalQuestions,
        });
      });
      this.diffiultylevelTable.renderRows();
      console.log(this.difficultyDataSource);
    });
  }

  getSectionalTotalCount(param: string) {
    let sum = 0;
    this.sectoionLevelDataSource.forEach((x) => (sum += x[param]));
    return sum;
  }

  getDifficultLevelTotalCount(param: string) {
    let sum = 0;
    this.difficultyDataSource.forEach((x) => (sum += x[param]));
    return Math.round(sum)/100 ;
  }

  getAverage(value, total) {
    if (total != 0) {
      return Math.round(value / total);
    } else return 0;
  }

  getAccuracy(correct, incorrect) {
    const attempted = correct + incorrect;
    if (correct == 0) {
      return 0;
    } else {
      return Math.round((correct / attempted) * 100);
    }
  }
}
