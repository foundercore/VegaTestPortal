export class QuestionExport {
  name: any;
  type: any;
  description: any;
  passage: any;
  tags: any;
  options: any;
  correct_answer: any;
  correct_options: any;
  explanation: any;
  positiveMark: any;
  negativeMark: any;
  skipMark: any;
  difficulty_level: any;
  subject: any;
  topic: any;
  sub_topic: any;
  reference: any;



  constructor(data: any) {
    this.name = data.name;
    this.type = data.type;
    this.description = data.description;
    this.passage = data.passageContent;
    this.tags = data.tags ? data.tags.join() : '';
    this.options = {};
    data.options.map(x => {
      this.options[x.key] = x.value;
    });
    this.correct_answer = data.answer.answerText;
    this.correct_options = data.answer.options;
    this.explanation = data.explanation;

    this.positiveMark = data.positiveMark;
    this.negativeMark = data.negativeMark;
    this.skipMark = data.skipMark;
    this.difficulty_level = data.difficultyLevel;

    this.subject = data.subject;
    this.topic = data.topic;
    this.sub_topic = data.subTopic;

    this.reference = data.reference;




  }
}
