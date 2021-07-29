import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { QuestionModel } from 'src/app/models/questions/question-model';
import { QuestionManagementService } from 'src/app/services/question-management/question-management.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-question-form-preview',
  templateUrl: './question-form-preview.component.html',
  styleUrls: ['./question-form-preview.component.scss'],
})
export class QuestionFormPreviewComponent implements OnInit {
  questionPreviewGroup = new FormGroup({
    passage: new FormControl(),
    name: new FormControl(),
    explanation: new FormControl(),
    description: new FormControl(),
    type: new FormControl(),
    positiveMark: new FormControl(),
    negativeMark: new FormControl(),
    skipMark: new FormControl(),
    bookReference: new FormControl(),
    tags: new FormControl(),
    subject: new FormControl(),
    topic: new FormControl(),
    subTopic: new FormControl(),
    difficulty: new FormControl(),
    answerText: new FormControl(),
  });

  options;

  answerOptionFormGrp: FormGroup;
  optionArrays: FormArray;

  descriptionEditorconfig: AngularEditorConfig = {
    editable: false,
    spellcheck: true,
    minHeight: '10rem',
    maxHeight: '10rem',
    placeholder: 'Enter Description here...',
    translate: 'no',
    sanitize: false,
    enableToolbar: false,
    showToolbar: false,
    toolbarPosition: 'top',
    defaultFontName: 'Arial',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };

  constructor(
    private router: Router,
    private activateRouter: ActivatedRoute,
    public translate: TranslateService,
    private questionManagementService: QuestionManagementService,
    private location: Location,
    private fb: FormBuilder
  ) {
    this.answerOptionFormGrp = this.fb.group({
      optionArrays: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.activateRouter.params.subscribe((params) => {
      if (params.id) {
        this.questionManagementService
          .getQuestion(params.id)
          .subscribe((resp) => {
            this.questionPreviewGroup
              .get('description')
              ?.setValue(resp.description);
            this.questionPreviewGroup
              .get('difficulty')
              ?.setValue(resp.difficultyLevel);
            this.questionPreviewGroup
              .get('explanation')
              ?.setValue(resp.explanation);
            this.questionPreviewGroup.get('name')?.setValue(resp.name);
            this.questionPreviewGroup
              .get('negativeMark')
              ?.setValue(resp.negativeMark);
            this.questionPreviewGroup
              .get('passage')
              ?.setValue(resp.passageContent);
            this.questionPreviewGroup
              .get('positiveMark')
              ?.setValue(resp.positiveMark);
            this.questionPreviewGroup
              .get('bookReference')
              ?.setValue(resp.reference);
            this.questionPreviewGroup.get('skipMark')?.setValue(resp.skipMark);
            this.questionPreviewGroup.get('subject')?.setValue(resp.subject);
            this.questionPreviewGroup.get('subTopic')?.setValue(resp.subTopic);
            this.questionPreviewGroup.get('topic')?.setValue(resp.topic);
            this.questionPreviewGroup.get('type')?.setValue(resp.type);

            if (resp.type == 'TITA') {
              this.questionPreviewGroup
                .get('answerText')
                ?.setValue(resp.answer.answerText);
            }

            this.options = resp.options;
            this.options.forEach((x) => {
              this.addOption();
            });

            this.answerOptionFormGrp
              .get('optionArrays')
              ['controls'].forEach((x, i) => {
                x.get('value').setValue(resp.options[i].value);
              });

            for (let i = 0; i < resp.answer.options.length; i++) {
              for (let j = 0; j < resp.options.length; j++) {
                if (resp.answer.options[i] == resp.options[j].key) {
                  this.answerOptionFormGrp.controls.optionArrays['controls'][
                    resp.options[j].key
                  ]['controls'].flag.setValue(true);
                }
              }
            }
          });

        this.questionPreviewGroup.disable();
        this.answerOptionFormGrp.disable();
      }
    });
  }

  cancel() {
    this.location.back();
    // this.router.navigate(['home/questionmanagement']);
  }

  addOption(): void {
    this.optionArrays = this.answerOptionFormGrp.get(
      'optionArrays'
    ) as FormArray;
    this.optionArrays.push(this.createOption());
  }

  createOption() {
    return this.fb.group({
      flag: [''],
      value: [''],
    });
  }
}
