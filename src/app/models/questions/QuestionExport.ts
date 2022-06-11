export class QuestionExport {
  questionId: any;
  answer: any;
  description: any;
  difficultyLevel: any;
  explanation: any;
  name: any;
  positiveMark: any;
  negativeMark: any;
  skipMark: any;
  passageId: any;
  passageContent: any;
  subject: any;
  topic: any;
  subTopic: any;
  type: any;
  options: any;

  constructor(data:any){
      this.questionId = data.id.questionId;
      this.answer = data.answer;
      this.description = data.description;
      this.difficultyLevel = data.difficultyLevel;
      this.explanation = data.explanation;
      this.name = data.name;
      this.positiveMark = data.positiveMark;
      this.negativeMark = data.negativeMark;
      this.skipMark = data.skipMark;
      this.passageId = data.passageId;
      this.passageContent = data.passageContent;
      this.subject = data.subject;
      this.topic = data.topic;
      this.subTopic = data.subTopic;
      this.type = data.type;
      this.options = data.options;
  }
}
