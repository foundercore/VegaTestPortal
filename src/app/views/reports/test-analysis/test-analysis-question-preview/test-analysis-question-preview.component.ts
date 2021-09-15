import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TranslateService } from '@ngx-translate/core';
import { QuestionManagementService } from 'src/app/services/question-management/question-management.service';
import { DialogData, VideoPreviewComponent } from 'src/app/views/questions/video-preview/video-preview.component';

@Component({
  selector: 'app-test-analysis-question-preview',
  templateUrl: './test-analysis-question-preview.component.html',
  styleUrls: ['./test-analysis-question-preview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestAnalysisQuestionPreviewComponent implements OnInit {

  questionPreviewGroup = new FormGroup({
    passage: new FormControl(),
    name: new FormControl(),
    explanation: new FormControl(),
    description: new FormControl(),
    type: new FormControl(),
    videoUrl: new FormControl(),
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

  displayUrl: any;

  constructor(
    private router: Router,
    private activateRouter: ActivatedRoute,
    public translate: TranslateService,
    private questionManagementService: QuestionManagementService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.answerOptionFormGrp = this.fb.group({
      optionArrays: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.questionManagementService
    .getQuestion(this.data?.questionId)
    .subscribe((resp) => {
      this.displayUrl = resp.videoExplanationUrl;
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

      if (resp.type == 'MCQ') {
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
                j
              ]['controls'].flag.setValue(true);
            }
          }
        }
      }
    });

  this.questionPreviewGroup.disable();
  this.answerOptionFormGrp.disable();
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

  openDialog(): void {
    const dialogRef = this.dialog.open(VideoPreviewComponent, {
      data: { videoUrl: this.displayUrl },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

}
