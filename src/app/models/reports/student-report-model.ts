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
