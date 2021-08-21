import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-section-wise-summary',
  templateUrl: './section-wise-summary.component.html',
  styleUrls: ['./section-wise-summary.component.scss']
})
export class SectionWiseSummaryComponent implements OnInit {

  sectoionLevelDataSource = [];

  difficultyDataSource = [];

  sectionLevelSummaryDisplayedColumns: string[] = ['name', 'correct', 'incorrect', 'skipped','marks','percentile'];

  difficultySummaryDisplayedColumns : string[] = ['level', 'correctCount', 'correctAvgTime', 'incorrectCount',
  'incorrectAvgTime','skippedCount','skippedAvgTime','marks'];

  @Input() summaryData = new EventEmitter();


  @ViewChild('sectionTable') sectionTable: MatTable<any>;

  @ViewChild('diffiultylevelTable') diffiultylevelTable: MatTable<any>;


  constructor() { }

  ngOnInit() {

    this.summaryData.subscribe(resp => {
      resp.sections.forEach(section => {
        this.sectoionLevelDataSource.push({
          name:section.sectionName,
          correct:section.metric.correct,
          incorrect:section.metric.incorrect,
          skipped:section.metric.skipped,
          marks:section.metric.totalMarks,
          percentileScore:section.metric.percentileScore
        })
      });
      this.sectionTable.renderRows();
      console.log(this.sectoionLevelDataSource);

      resp.difficulty.forEach(level => {
        this.difficultyDataSource.push({
          level:level.difficultyLevel,
          correctCount:level.metric.correct,
          correctAvgTime: level.metric.correct != 0 ? Math.round(level.metric.correctTimeInSec/level.metric.correct ) : 0,
          incorrectCount:level.metric.incorrect,
          incorrectAvgTime: level.metric.incorrect != 0 ? Math.round(level.metric.incorrectTimeInSec/level.metric.incorrect) : 0,
          skippedCount:level.metric.skipped,
          skippedAvgTime: level.metric.skipped != 0 ? Math.round(level.metric.skippedTimeInSec/level.metric.skipped) : 0,
          marks:level.metric.totalMarks,
          totalQuestions: level.metric.totalQuestions
        })
      });
      this.diffiultylevelTable.renderRows();
      console.log(this.difficultyDataSource);

    })
  }


  getSectionalTotalCount(param:string){
    let sum = 0;
    this.sectoionLevelDataSource.forEach(x => sum+= x[param]);
    return sum;
  }


  getDifficultLevelTotalCount(param:string){
    let sum = 0;
    this.difficultyDataSource.forEach(x => sum+= x[param]);
    return sum;
  }

  getAverage(value,total){
    if(total != 0){
      return Math.round(value/total);
    } else
        return 0;
  }


  getTotalAveragerrect

}
