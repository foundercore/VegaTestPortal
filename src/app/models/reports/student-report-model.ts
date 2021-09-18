export class StudentReportModel {
  name: string = '';
  questions: number = 0;
  timeTaken: number = 0;
  attempt: number = 0;
  incorrect: number = 0;
  skipped: number = 0;
  score: number = 0;
  accuracy: number = 0;
  correct: number = 0;
}

export class SectDifficultyStatsModel{
  name : string = '';
  easy : number = 0;
  easyTime : number = 0;
  medium : number = 0;
  mediumTime : number = 0;
  hard : number = 0;
  hardTime : number = 0;
  veryHard : number = 0;
  veryHardTime : number = 0;
  easyCorrect 	: number = 0;
  easySkipped 	: number = 0;
  easyIncorrect 	: number = 0;
  mediumCorrect 	: number = 0;
  mediumIncorrect : number = 0;
  mediumSkipped 	: number = 0;
  hardCorrect 	: number = 0;
  hardIncorrect 	: number = 0;
  hardSkipped 	: number = 0;
}


export class TimeAnalysisStatsModel{
  name : string = '';
  easyCorrectTime 	: number = 0;
  easySkippedTime 	: number = 0;
  easyIncorrectTime 	: number = 0;
  mediumCorrectTime 	: number = 0;
  mediumIncorrectTime : number = 0;
  mediumSkippedTime 	: number = 0;
  hardCorrectTime 	: number = 0;
  hardIncorrectTime 	: number = 0;
  hardSkippedTime 	: number = 0;
}


export interface Metric {
  attempted: number;
  correct: number;
  correctTimeInSec: number;
  incorrect: number;
  incorrectTimeInSec: number ;
  marksReceived: number;
  negativeMarks: number;
  positiveMarks:number;
  skipped: number;
  skippedMarks: number;
  skippedTimeInSec: number;
  totalMarks: number;
  totalQuestions: number;
  totalTimeInSec: number;
}
