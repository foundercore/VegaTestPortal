import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { QuestionModel } from 'src/app/models/questions/question-model';
import { QuestionManagementService } from 'src/app/services/question-management/question-management.service';

@Component({
  selector: 'app-question-form-preview',
  templateUrl: './question-form-preview.component.html',
  styleUrls: ['./question-form-preview.component.scss']
})
export class QuestionFormPreviewComponent implements OnInit {

  questionPreviewGroup = new FormGroup ({
    name: new FormControl( ),
    description: new FormControl(),
    subject: new FormControl( ),
    topic: new FormControl(),
    subTopic: new FormControl(),
    difficulty: new FormControl(),
    positiveMark: new FormControl(),
    negativeMark: new FormControl(),
    skipMark: new FormControl(),
    type: new FormControl(),
    tags: new FormControl(),
    explanation: new FormControl(),
    bookReference: new FormControl(),
    passage: new FormControl(),
    answerText: new FormControl(),

  });

  options ;

  answerOptionFormGrp = new FormGroup({});

  constructor(
    private router: Router,
    private activateRouter: ActivatedRoute,
    public translate: TranslateService,
    private questionManagementService: QuestionManagementService
    ) { }

  ngOnInit() {
    this.activateRouter.params.subscribe(params => {
      if(params.id) {
        this.questionManagementService.getQuestion(params.id).subscribe(resp => {
          this.questionPreviewGroup.get('description')?.setValue(resp.description);
          this.questionPreviewGroup.get('difficulty')?.setValue(resp.difficultyLevel);
          this.questionPreviewGroup.get('explanation')?.setValue(resp.explanation);
          this.questionPreviewGroup.get('name')?.setValue(resp.name);
          this.questionPreviewGroup.get('negativeMark')?.setValue(resp.negativeMark);
          this.questionPreviewGroup.get('passage')?.setValue(resp.passageContent);
          this.questionPreviewGroup.get('positiveMark')?.setValue(resp.positiveMark);
          this.questionPreviewGroup.get('bookReference')?.setValue(resp.reference);
          this.questionPreviewGroup.get('skipMark')?.setValue(resp.skipMark);
          this.questionPreviewGroup.get('subject')?.setValue(resp.subject);
          this.questionPreviewGroup.get('subTopic')?.setValue(resp.subTopic);
          this.questionPreviewGroup.get('topic')?.setValue(resp.topic);
          this.questionPreviewGroup.get('type')?.setValue(resp.type);
          this.questionPreviewGroup.get('answerText')?.setValue(resp.answer.answerText);
          this.options = resp.options;
          this.options.forEach(x => {
            const newCntrl = new FormControl();
            this.answerOptionFormGrp.addControl(x.key,newCntrl);
          })
          resp.answer.options.forEach(x => {
            this.answerOptionFormGrp.controls[x].setValue(true);
          });
        })
        this.questionPreviewGroup.disable();
        this.answerOptionFormGrp.disable();
      }
     });
  }


  cancel(){
    this.router.navigate(['home/questionmanagement']);
  }

}
