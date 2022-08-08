import { Output } from '@angular/core';

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
    this.name = this.getImageFreeString(data.name);
    this.type = data.type;
    this.description = this.getImageFreeString(data.description);
    this.passage = this.getImageFreeString(data.passageContent);
    this.tags = data.tags ? data.tags.join() : '';
    this.options = {};
    data.options.map(x => {
      this.options[x.key] = this.getImageFreeString(x.value);
    });
    this.correct_answer = this.getImageFreeString(data.answer.answerText);
    this.correct_options = data.answer.options;
    this.explanation = this.getImageFreeString( data.explanation);

    this.positiveMark = data.positiveMark;
    this.negativeMark = data.negativeMark;
    this.skipMark = data.skipMark;
    this.difficulty_level = data.difficultyLevel;

    this.subject = data.subject;
    this.topic = data.topic;
    this.sub_topic = data.subTopic;

    this.reference = data.reference;




  }

  getImageFreeString(input: string){
    if (!input || input.indexOf('data:image') < 0){
      return input;
    }

    // console.log('in getImageFreeString for: \n ' + input);
    var output = '';
    while (input.indexOf('data:image')>0){
      var firstPart = input.slice(0, input.indexOf('data:image'));
      // console.log('firstpart: '+ firstPart);
      input = input.slice(input.indexOf('data:image') +  1, input.length);
      var secondPart = input.slice(input.indexOf('\"'), input.length);
      input = secondPart;
      // console.log('secondPart: ' + secondPart);
      output = firstPart + secondPart;
      // console.log('output: ' + output);
    }
    return output;
  }
}
