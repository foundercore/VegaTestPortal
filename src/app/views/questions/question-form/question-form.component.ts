import { QuestionConstants, QuestionModel } from './../../../models/questions/question-model';
import { QuestionManagementService } from './../../../services/question-management/question-management.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { QuestionOption } from 'src/app/models/questions/question-option-model';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionAnswer } from 'src/app/models/questions/question-answer-model';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
declare var WirisPlugin: any;

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss'],
})
export class QuestionFormComponent implements OnInit, AfterViewInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  updatedQuestion?: QuestionModel | undefined;

  tags: string[] | undefined = [];
  isNewForm = true;

  difficultyLevel: string[] = QuestionConstants.DIFFICULTY_LEVEL;
  questionTypeList : string[] = [];

  options: QuestionOption[] | undefined = [];

  stepOneFormGroup = new FormGroup({
    name: new FormControl(),
    passage: new FormControl(),
    explanation: new FormControl(),
    description: new FormControl(),
    type: new FormControl(),
    answerText: new FormControl(),
  });

  secondStepFromGroup = new FormGroup({
    positiveMark: new FormControl(),
    negativeMark: new FormControl(),
    skipMark: new FormControl(),
    bookReference: new FormControl(),
    tags: new FormControl(),
    subject: new FormControl(),
    topic: new FormControl(),
    subTopic: new FormControl(),
    difficulty: new FormControl(),
  });


  questionForthFormGrp = new FormGroup({
    correctOption: new FormControl(),
    answerText: new FormControl(),
  });

  // answerOptionFormGrp = new FormGroup({});

  answerOptionFormGrp: FormGroup;
  optionArrays: FormArray  ;

  optionCount = '0';

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
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };

  optionItems = [];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private activateRouter: ActivatedRoute,
    public translate: TranslateService,
    private questionManagementService: QuestionManagementService,
    private location: Location,
    private fb: FormBuilder
  ) {
    forkJoin([this.questionManagementService.getQuestionType()]).subscribe(
      (results) => {
        this.questionTypeList = results[0];
        this.questionTypeList = this.questionTypeList.filter(
          (x) => x === 'MCQ' || x === 'TITA'
        );
      }
    );

    this.answerOptionFormGrp = this.fb.group({
      optionArrays: this.fb.array([]),
    });
  }

  ngAfterViewInit(): void {
    this.bindEquationToEditor();
  }

  ngOnInit() {
    this.activateRouter.params.subscribe((params) => {
      if (params.id) {
        this.questionManagementService
          .getQuestion(params.id)
          .subscribe((resp) => {
            this.isNewForm = false;
            this.updatedQuestion = resp;
            this.stepOneFormGroup.get('passage')?.setValue(resp.passageContent);
            this.stepOneFormGroup.get('name')?.setValue(resp.name);
            this.stepOneFormGroup
              .get('explanation')
              ?.setValue(resp.explanation);
            this.stepOneFormGroup
              .get('description')
              ?.setValue(resp.description);
            this.stepOneFormGroup.get('type')?.setValue(resp.type);
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

            this.questionForthFormGrp
              .get('answerText')
              ?.setValue(resp.answer.answerText);

            this.secondStepFromGroup
              .get('positiveMark')
              ?.setValue(resp.positiveMark);
            this.secondStepFromGroup
              .get('negativeMark')
              ?.setValue(resp.negativeMark);
            this.secondStepFromGroup.get('skipMark')?.setValue(resp.skipMark);
            this.secondStepFromGroup
              .get('bookReference')
              ?.setValue(resp.reference);
            if (resp.tags) {
              this.tags = resp.tags;
            }
            this.secondStepFromGroup.get('subject')?.setValue(resp.subject);
            this.secondStepFromGroup.get('topic')?.setValue(resp.topic);
            this.secondStepFromGroup.get('subTopic')?.setValue(resp.subTopic);
            this.secondStepFromGroup
              .get('difficulty')
              ?.setValue(resp.difficultyLevel);
          });
      }
    });
  }

  createOption() {
    return this.fb.group({
      flag: [''],
      value: [''],
    });
  }

  addOption(): void {
    this.optionArrays = this.answerOptionFormGrp.get(
      'optionArrays'
    ) as FormArray;
    this.optionArrays.push(this.createOption());
  }

  removeOption(index) {
    console.log(index);
    (<FormArray>this.answerOptionFormGrp.get('optionArrays')).removeAt(index);
  }

  // addOption() {
  //   this.options?.push({ key: this.optionCount, value: '' });
  //   const newCntrl = new FormControl();
  //   this.answerOptionFormGrp.addControl(this.optionCount, newCntrl);
  //   this.optionCount = String(parseInt(this.optionCount) + 1);
  // }

  // removeOption(index: number, option: QuestionOption) {
  //   this.options?.splice(index, 1);
  //   this.answerOptionFormGrp.removeControl(option.key);
  // }

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

    if (index != undefined && index >= 0) {
      this.tags?.splice(index, 1);
    }
  }

  createQuestion() {
    const answerOptions = [];
    const trueOptions = [];

    // for (const field in this.answerOptionFormGrp.controls) {
    //   if (this.answerOptionFormGrp.controls[field].value)
    //     answerOptions.push(field);
    // }

    this.answerOptionFormGrp.get('optionArrays')['controls'].forEach((x, i) =>
      answerOptions.push({
        key: i,
        flag: x.get('flag').value ? '1' : '0',
        value: x.get('value').value,
      })
    );

    answerOptions.forEach((x) => {
      if (x.flag == 1) {
        trueOptions.push(x.key);
      }
    });

    let questionAnswer: QuestionAnswer = {
      answerText: this.questionForthFormGrp.get('answerText')?.value,
      options: trueOptions,
    };

    let question: QuestionModel = {
      answer: questionAnswer,
      passageContent: this.stepOneFormGroup.get('passage')?.value,
      name: this.stepOneFormGroup.get('name')?.value,
      explanation: this.stepOneFormGroup.get('explanation')?.value,
      description: this.stepOneFormGroup.get('description')?.value,
      type: this.stepOneFormGroup.get('type')?.value,
      options: answerOptions,
      positiveMark: this.secondStepFromGroup.get('positiveMark')?.value,
      negativeMark: this.secondStepFromGroup.get('negativeMark')?.value,
      skipMark: this.secondStepFromGroup.get('skipMark')?.value,
      reference: this.secondStepFromGroup.get('bookReference')?.value,
      tags: this.tags,
      subject: this.secondStepFromGroup.get('subject')?.value,
      topic: this.secondStepFromGroup.get('topic')?.value,
      subTopic: this.secondStepFromGroup.get('subTopic')?.value,
      difficultyLevel: this.secondStepFromGroup.get('difficulty')?.value.toUpperCase() ,
    };

    console.log(question);

    this.questionManagementService.createQuestion(question).subscribe(
      (resp) => {
        this.toastr.success('Question Created Successfully');
        this.cancel();
      },
      (error) => {
        this.toastr.error(error.error.apierror.message);
      }
    );
  }

  updateQuestion() {
    const answerOptions = [];
    const trueOptions = [];

    this.answerOptionFormGrp.get('optionArrays')['controls'].forEach((x, i) =>
      answerOptions.push({
        key: i,
        flag: x.get('flag').value ? '1' : '0',
        value: x.get('value').value,
      })
    );

    answerOptions.forEach((x) => {
      if (x.flag == 1) {
        trueOptions.push(x.key);
      }
    });

    // for (const field in this.answerOptionFormGrp.controls) {
    //   if (this.answerOptionFormGrp.controls[field].value)
    //     answerOptions.push(field);
    // }

    let questionAnswer: QuestionAnswer = {
      answerText: this.questionForthFormGrp.get('answerText')?.value,
      options: trueOptions,
    };
    //this.updatedQuestion.
    if (this.updatedQuestion) {
      this.updatedQuestion.answer = questionAnswer;
      this.updatedQuestion.passageContent =
        this.stepOneFormGroup.get('passage')?.value;
      this.updatedQuestion.name = this.stepOneFormGroup.get('name')?.value;
      this.updatedQuestion.explanation =
        this.stepOneFormGroup.get('explanation')?.value;
      this.updatedQuestion.description =
        this.stepOneFormGroup.get('description')?.value;
      this.updatedQuestion.type = this.stepOneFormGroup.get('type')?.value;
      this.updatedQuestion.options = answerOptions;

      this.updatedQuestion.positiveMark =
        this.secondStepFromGroup.get('positiveMark')?.value;
      this.updatedQuestion.negativeMark =
        this.secondStepFromGroup.get('negativeMark')?.value;
      this.updatedQuestion.skipMark =
        this.secondStepFromGroup.get('skipMark')?.value;
      this.updatedQuestion.reference =
        this.secondStepFromGroup.get('bookReference')?.value;
      this.updatedQuestion.subject =
        this.secondStepFromGroup.get('subject')?.value;
      this.updatedQuestion.topic = this.secondStepFromGroup.get('topic')?.value;
      this.updatedQuestion.subTopic =
        this.secondStepFromGroup.get('subTopic')?.value;
      this.updatedQuestion.difficultyLevel =
        this.secondStepFromGroup.get('difficulty')?.value;
      this.updatedQuestion.tags = this.tags;

      this.questionManagementService
        .updateQuestion(this.updatedQuestion)
        .subscribe(
          (resp) => {
            this.toastr.success('Question Updated Successfully');
            this.cancel();
          },
          (error) => {
            this.toastr.error(error.error.apierror.message);
          }
        );
    }
  }

  cancel() {
    this.location.back();
    // this.router.navigate(['home/questionmanagement']);
  }

  bindEquationToEditor() {
    var genericIntegrationProperties_name_editor = {
      target: document
        .getElementById('name_editor')
        .getElementsByClassName('angular-editor-textarea')[0],
      toolbar: document
        .getElementById('name_editor')
        .getElementsByClassName('angular-editor-toolbar-set')[
        document
          .getElementById('name_editor')
          .getElementsByClassName('angular-editor-toolbar-set').length - 1
      ],
    };

    var genericIntegrationProperties_description_editor = {
      target: document
        .getElementById('description_editor')
        .getElementsByClassName('angular-editor-textarea')[0],
      toolbar: document
        .getElementById('description_editor')
        .getElementsByClassName('angular-editor-toolbar-set')[
        document
          .getElementById('description_editor')
          .getElementsByClassName('angular-editor-toolbar-set').length - 1
      ],
    };

    var genericIntegrationProperties_explanation_editor = {
      target: document
        .getElementById('explanation_editor')
        .getElementsByClassName('angular-editor-textarea')[0],
      toolbar: document
        .getElementById('explanation_editor')
        .getElementsByClassName('angular-editor-toolbar-set')[
        document
          .getElementById('explanation_editor')
          .getElementsByClassName('angular-editor-toolbar-set').length - 1
      ],
    };

    var genericIntegrationProperties_passage_editor = {
      target: document
        .getElementById('passage_editor')
        .getElementsByClassName('angular-editor-textarea')[0],
      toolbar: document
        .getElementById('passage_editor')
        .getElementsByClassName('angular-editor-toolbar-set')[
        document
          .getElementById('passage_editor')
          .getElementsByClassName('angular-editor-toolbar-set').length - 1
      ],
    };

    // GenericIntegration instance.
    var genericIntegrationInstance = new WirisPlugin.GenericIntegration(
      genericIntegrationProperties_name_editor
    );
    genericIntegrationInstance.init();
    genericIntegrationInstance.listeners.fire('onTargetReady', {});

    var genericIntegrationInstance = new WirisPlugin.GenericIntegration(
      genericIntegrationProperties_description_editor
    );
    genericIntegrationInstance.init();
    genericIntegrationInstance.listeners.fire('onTargetReady', {});

    var genericIntegrationInstance = new WirisPlugin.GenericIntegration(
      genericIntegrationProperties_explanation_editor
    );
    genericIntegrationInstance.init();
    genericIntegrationInstance.listeners.fire('onTargetReady', {});

    var genericIntegrationInstance = new WirisPlugin.GenericIntegration(
      genericIntegrationProperties_passage_editor
    );
    genericIntegrationInstance.init();
    genericIntegrationInstance.listeners.fire('onTargetReady', {});
  }

  onTypeChange($event) {
    if ($event.value == 'MCQ') {
      this.answerOptionFormGrp = this.fb.group({
        optionArrays: this.fb.array([]),
      });

      for (let i = 0; i < 4; i++) {
        this.addOption();
      }
    }

    if ($event.value == 'TITA') {
      this.questionForthFormGrp.controls['answerText'].reset();
    }
  }
}
