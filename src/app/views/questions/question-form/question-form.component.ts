import { QuestionModel } from './../../../models/questions/question-model';
import { QuestionManagementService } from './../../../services/question-management/question-management.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { QuestionOption } from 'src/app/models/questions/question-option-model';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionAnswer } from 'src/app/models/questions/question-answer-model';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss']
})
export class QuestionFormComponent implements OnInit {


  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  updatedQuestion? : QuestionModel | undefined;

  tags: string[] | undefined = [];
  isNewForm = true;
  difficultyLevel : string[] = ['Easy','Medium','Hard'];
  questionTypeList : string[] = [];

  options: QuestionOption[] | undefined = [];

  questionFirstFormGrp = new FormGroup ({
    name: new FormControl(),
    description: new FormControl(),
    subject: new FormControl(),
    topic: new FormControl(),
    subTopic: new FormControl(),
    difficulty: new FormControl(),
  });

  questionSecondFormGrp = new FormGroup ({
    positiveMark: new FormControl(),
    negativeMark: new FormControl(),
    skipMark: new FormControl(),
  })

  questionThirdFormGrp = new FormGroup ({
    type: new FormControl(),
    tags: new FormControl(),
    passage: new FormControl(),
    explanation: new FormControl(),
    bookReference: new FormControl()
  })

  questionForthFormGrp = new FormGroup ({
    correctOption: new FormControl(),
    answerText: new FormControl()
  });


  answerOptionFormGrp = new FormGroup({

  })

  optionCount = "0";



  descriptionEditorconfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '10rem',
    maxHeight: '10rem',
    placeholder: 'Enter Description here...',
    translate: 'no',
    sanitize: false,
    enableToolbar: true,
    showToolbar: true,
    toolbarPosition: 'top',
    defaultFontName: 'Arial',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ]
  };


  constructor(
    private router: Router,
    private toastr: ToastrService,
    private activateRouter: ActivatedRoute,
    public translate: TranslateService,
    private questionManagementService: QuestionManagementService
    ) {

      forkJoin([this.questionManagementService.getQuestionType()
      ]).subscribe(results => {
        this.questionTypeList = results[0];
      })

     }

  ngOnInit() {
    this.activateRouter.params.subscribe(params => {
      if(params.id) {
        this.questionManagementService.getQuestion(params.id).subscribe(resp => {
          console.log(resp);
          this.isNewForm = false;
          this.updatedQuestion =resp;
          this.questionFirstFormGrp.get('description')?.setValue(resp.description);
          this.questionFirstFormGrp.get('difficulty')?.setValue(resp.difficultyLevel);
          this.questionThirdFormGrp.get('explanation')?.setValue(resp.explanation);
          this.questionFirstFormGrp.get('name')?.setValue(resp.name);
          this.questionSecondFormGrp.get('negativeMark')?.setValue(resp.negativeMark);
          this.options = resp.options;
          this.questionThirdFormGrp.get('passage')?.setValue(resp.passageContent);
          this.questionSecondFormGrp.get('positiveMark')?.setValue(resp.positiveMark);
          this.questionThirdFormGrp.get('bookReference')?.setValue(resp.reference);
          this.questionSecondFormGrp.get('skipMark')?.setValue(resp.skipMark);
          this.questionFirstFormGrp.get('subject')?.setValue(resp.subject);
          this.questionFirstFormGrp.get('subTopic')?.setValue(resp.subTopic);
          if(resp.tags){
            this.tags = resp.tags;
          }
          this.questionFirstFormGrp.get('topic')?.setValue(resp.topic);
          this.questionThirdFormGrp.get('type')?.setValue(resp.type);
          this.options.forEach(x => {
            const newCntrl = new FormControl();
            this.answerOptionFormGrp.addControl(x.key,newCntrl);
            this.optionCount = parseInt(x.key) > parseInt(this.optionCount)  ? x.key : String(parseInt(this.optionCount));
          })
          resp.answer.options.forEach(x => {
            this.answerOptionFormGrp.controls[x].setValue(true);
          });
        })
      }
     });
  }

  addOption() {
    this.options?.push({key:this.optionCount,value:''});
    const newCntrl = new FormControl();
    this.answerOptionFormGrp.addControl(this.optionCount,newCntrl);
    this.optionCount = String(parseInt(this.optionCount) + 1);
  }

  removeOption(index: number,option: QuestionOption) {
    this.options?.splice(index, 1);
    this.answerOptionFormGrp.removeControl(option.key);

  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.tags?.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: string): void {
    const index = this.tags?.indexOf(tag);

    if (index !=undefined && index >= 0) {
      this.tags?.splice(index, 1);
    }
  }

  createQuestion(){
    const answerOptions = [];

    for (const field in this.answerOptionFormGrp.controls) {
      if(this.answerOptionFormGrp.controls[field].value)
                answerOptions.push(field);
     }

    let questionAnswer : QuestionAnswer = {
      answerText : this.questionForthFormGrp.get('answerText')?.value,
      options :answerOptions
    }

    let question : QuestionModel = {
      answer: questionAnswer,
      description: this.questionFirstFormGrp.get('description')?.value,
      difficultyLevel:  this.questionFirstFormGrp.get('difficulty')?.value,
      explanation: this.questionThirdFormGrp.get('explanation')?.value,
      name:  this.questionFirstFormGrp.get('name')?.value,
      negativeMark: this.questionSecondFormGrp.get('negativeMark')?.value,
      options: this.options,
      passageContent:  this.questionThirdFormGrp.get('passage')?.value,
      positiveMark: this.questionSecondFormGrp.get('positiveMark')?.value,
      reference:  this.questionThirdFormGrp.get('bookReference')?.value,
      skipMark: this.questionSecondFormGrp.get('skipMark')?.value,
      subject:  this.questionFirstFormGrp.get('subject')?.value,
      subTopic:  this.questionFirstFormGrp.get('subTopic')?.value,
      tags:  this.tags,
      topic:  this.questionFirstFormGrp.get('topic')?.value,
      type:  this.questionThirdFormGrp.get('type')?.value
    };


    this.questionManagementService.createQuestion(question).subscribe(resp => {
        this.toastr.success('Question Created Successfully');
        this.cancel();
    }, error => {
      this.toastr.error(error.error.apierror.message);
    })

  }


  updateQuestion(){

    const answerOptions = [];

    for (const field in this.answerOptionFormGrp.controls) {
      if(this.answerOptionFormGrp.controls[field].value)
      answerOptions.push(field);
     }

    let questionAnswer : QuestionAnswer = {
      answerText : this.questionForthFormGrp.get('answerText')?.value,
      options :answerOptions
    }
    //this.updatedQuestion.
    if(this.updatedQuestion){
      this.updatedQuestion.answer = questionAnswer;
      this.updatedQuestion.description= this.questionFirstFormGrp.get('description')?.value;
      this.updatedQuestion.difficultyLevel =  this.questionFirstFormGrp.get('difficulty')?.value;
      this.updatedQuestion.explanation =this.questionThirdFormGrp.get('explanation')?.value;
      this.updatedQuestion.name =  this.questionFirstFormGrp.get('name')?.value;
      this.updatedQuestion.negativeMark = this.questionSecondFormGrp.get('negativeMark')?.value;
      this.updatedQuestion.options = this.options;
      this.updatedQuestion.passageContent = this.questionThirdFormGrp.get('passage')?.value;
      this.updatedQuestion.positiveMark = this.questionSecondFormGrp.get('positiveMark')?.value;
      this.updatedQuestion.reference =  this.questionThirdFormGrp.get('bookReference')?.value;
      this.updatedQuestion.skipMark = this.questionSecondFormGrp.get('skipMark')?.value;
      this.updatedQuestion.subject =  this.questionFirstFormGrp.get('subject')?.value;
      this.updatedQuestion.subTopic =  this.questionFirstFormGrp.get('subTopic')?.value;
      this.updatedQuestion.tags = this.tags;
      this.updatedQuestion.topic =  this.questionFirstFormGrp.get('topic')?.value;
      this.updatedQuestion.type =  this.questionThirdFormGrp.get('type')?.value;

      this.questionManagementService.updateQuestion(this.updatedQuestion).subscribe(resp => {
        this.toastr.success('Question Updated Successfully');
        this.cancel();
        }, error => {
          this.toastr.error(error.error.apierror.message);
          })
        }
  }

  cancel(){
    this.router.navigate(['home/questionmanagement']);
  }
}
