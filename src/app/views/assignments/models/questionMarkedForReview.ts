export class QuestionMarkedForReviewModel {
  answerText: string;
  assignmentId: string;
  markForReview: boolean;
  questionId: string;
  sectionId: string;
  selectedOptions: [string];
  timeElapsedInSec: number;
}
