import { QuestionAnswer } from './question-answer-model';
import { QuestionId } from './question-id-model';
import { QuestionOption } from './question-option-model';
export interface QuestionModel {
  answer: QuestionAnswer | undefined;
  createdBy?: string | undefined;
  createdOn?: string | undefined;
  description: string | undefined;
  difficultyLevel: string | undefined;
  explanation:string | undefined;
  fileName?: string | undefined;
  id?: QuestionId | undefined;
  lastUpdatedBy?: string | undefined;
  lastUpdatedOn?: string | undefined;
  name: string | undefined;
  negativeMark: number | undefined;
  options: QuestionOption[] | undefined;
  passageContent: string | undefined;
  passageId?: string | undefined;
  positiveMark: number | undefined;
  reference: string | undefined;
  skipMark: number | undefined;
  subject: string | undefined;
  subTopic: string | undefined;
  tags: string[] | undefined;
  topic: string | undefined;
  type: string | undefined;
  usedInPapers?: {} | undefined;
  explanation_added?: string;
  videoExplanationUrl ?: string;
}



export class QuestionConstants {
  static DIFFICULTY_LEVEL: any = ['EASY', 'MEDIUM', 'HARD', 'VERY HARD'];
}