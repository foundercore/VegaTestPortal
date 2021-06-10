import { QuestionsViewModel } from './questionsVM';

export class Section {
  id: string = '';
  durationInMinutes: number = 0;
  name: string = '';
  testId: string = '';
  questions: QuestionsViewModel[];
  difficultyLevel: string;
  instructions: string;
}
