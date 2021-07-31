import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, timer } from 'rxjs';
import { MathService } from 'src/app/shared/directives/math/math.service';
import { AppState } from 'src/app/state_management/_states/auth.state';
import Swal from 'sweetalert2';
import { ButtonStyleAttributesModel } from '../../assignments/models/buttonStyleAttributesModel';
import { QuestionMarkedForReviewModel } from '../../assignments/models/questionMarkedForReview';
import { CalculatorComponent } from '../../assignments/popups/calculator/calculator.component';
import { TestConfigService } from '../../assignments/services/test-config-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-live-test',
  templateUrl: './live-test.component.html',
  styleUrls: ['./live-test.component.scss']
})
export class LiveTestComponent implements  OnInit {
  timeSeconds = 0;
  timeElapsedInSecond = 0;
  testId = '';

  questionNumber = 0;
  buttonStyle: ButtonStyleAttributesModel[] = [];

  questionNavigationButtonColorArray = [];
  sectionsWithPapers = [];
  sections = [];
  appState: any;
  userName = '';
  currentSectionSubmittedData: any;
  studentName = '';
  // scrollbar
  disabled = false;
  compact = false;
  invertX = false;
  invertY = false;
  CountDownTimerValue = '--:--:--';
  timerSource;
  shown: 'native' | 'hover' | 'always' = 'native';
  assignmentId = '';
  titaText = '';
  toasterPostion = {
    positionClass: 'toast-bottom-right'
  };

  isLoading = true;

  sectionQuestionMap = new Map<string,any>();

  currentSectionId: string;

  currentSelectedSection: any;

  currentSelectedQuestion: any;

  optionsSelected = [];

  previousOptionsSelected = [];

  submissionData: any;

  visitedQuestionList: string[] = [];

  answeredQuestionList: string[] = [];

  markForReviewQuestionList: string[] = [];

  @Input() testData;

  @Input() assignmentData;

  @Input() isTestLive = false;

  @ViewChild('TabGroup', { static: false }) Tab_Group: MatTabGroup;

  constructor(
    public dialog: MatDialog,
    private testConfigService: TestConfigService,
    private toastrService: ToastrService,
    private store: Store<AppState>,
    private router: Router,
    public mathService: MathService,
    private location: Location
  ) {

  }

  ngOnInit(): void {

    this.store.select('appState').subscribe((data) => {
      this.userName = data?.user?.userName;
      this.studentName = data?.user?.firstName + ' ' + data?.user?.lastName;
    });
    if(this.isTestLive)   {
      this.testId = this.assignmentData.testId;
      this.assignmentId = this.assignmentData.assignmentId;
    } else {
      this.testId = this.testData.questionPaperId;
    }
    this.initializeQuestion();
    if(this.isTestLive){
      this.getUserAllSubmissionData();
    }
  }

  initializeQuestion() {
    this.timeSeconds = this.convertminutestoseconds(
      this.testData.totalDurationInMinutes
    );
    if (this.testData.sections !== null) {
      this.getQuestionPapers();
    }
    if (this.isTestLive) {
      this.observableTimer(this.submissionData?.totalTestTimeTakenInSec);
    } else {
      this.CountDownTimerValue = new Date(this.timeSeconds * 1000) .toISOString().substr(11, 8);
    }
  }

  getQuestionPapers() {
    this.testData?.sections?.forEach((section,index) => {
      if (section != null && section.questions != null) {
        // sort question by Sequence
        section.questions.sort((a, b) =>
          a.sequenceNumber < b.sequenceNumber ? -1 : 1
        );

        let questionRequest  = [];

        section.questions.forEach((question) => {
          if (question != null) {
            questionRequest.push(this.testConfigService.getQuestionbyQestionId(question?.id));
          }
        });

        forkJoin(questionRequest).subscribe(questionList => {
            questionList.map(question => {
              question['sectionId'] = section.id;
              return question;
            })
            this.sections = this.sections.concat(questionList);
            this.sectionQuestionMap.set(section.id,questionList);
            if(index == 0 ){
              this.selectSection(section);
            }
            if(this.isTestLive){
              this.setCurrentQuestionSelectedOption();
            }
            this.isLoading = false;
        },
        error => {
          this.toastrService.error(
            error?.error?.message
              ? error?.error?.message
              : error?.message
            , '', this.toasterPostion
          );
        })
      }
    });
  }


  observableTimer(totalTestTimeTakenInSec = 0) {
    const source = timer(1000, 1000);
    this.timerSource = source.subscribe((val) => {
      this.timeElapsedInSecond++;
      const leftSecs = this.timeSeconds - val - totalTestTimeTakenInSec;
      if (leftSecs > 0) {
        this.CountDownTimerValue = new Date(leftSecs * 1000)
          .toISOString()
          .substr(11, 8);
      }
      else if (leftSecs == 0) {
        this.timerSource.unsubscribe();
        Swal.fire({
          icon: 'success',
          title: 'Test Over!!',
          confirmButtonText: 'Ok',
        }).finally(() => {
          this.submitAssessment();
        });
      }
    });
  }

  async setQuestionAsMarkerdForReview() {
    const quesForMarkedAsReview = new QuestionMarkedForReviewModel();
    quesForMarkedAsReview.answerText = this.currentSelectedQuestion.name;
    quesForMarkedAsReview.markForReview = true;
    quesForMarkedAsReview.assignmentId = this.assignmentId;
    quesForMarkedAsReview.questionId = this.currentSelectedQuestion.id.questionId;
    quesForMarkedAsReview.sectionId = this.currentSelectedQuestion.sectionId;
    quesForMarkedAsReview.selectedOptions = (this.getSelectedOption() as any);
    quesForMarkedAsReview.timeElapsedInSec = this.timeElapsedInSecond;

    this.testConfigService
      .setQuestionAsMarkedForReview(
        quesForMarkedAsReview.assignmentId,
        quesForMarkedAsReview
      )
      .subscribe(
        (res) => {
          this.toastrService.success(
            'Question is successfully marked for review', '', this.toasterPostion
          );
          this.getUserAllSubmissionData();
          this.goToNextQuestion();
        },
        (err) => console.log('Error while making the question for review', err)
      );
  }

  isCurrentQuestionMarkedForReview() {
    return this.markForReviewQuestionList.includes(this.currentSelectedQuestion.id.questionId);
  }

  async saveAndNextAnswers(moveToNext = true) {
    console.log('this.question=>', this.currentSelectedQuestion);
    this.isCurrentQuestionMarkedForReview();
    const quesForMarkedAsReview = new QuestionMarkedForReviewModel();
    quesForMarkedAsReview.answerText = this.titaText;
    quesForMarkedAsReview.markForReview = this.getSelectedOption() != null
      || this.titaText != null ? false : true;
    quesForMarkedAsReview.assignmentId = this.assignmentId;
    quesForMarkedAsReview.questionId = this.currentSelectedQuestion.id.questionId;
    quesForMarkedAsReview.sectionId = this.currentSelectedQuestion.sectionId;
    quesForMarkedAsReview.selectedOptions = (this.getSelectedOption() as any);
    quesForMarkedAsReview.timeElapsedInSec = this.timeElapsedInSecond;


    await this.testConfigService
      .saveandNextAnswers(
        quesForMarkedAsReview.assignmentId,
        quesForMarkedAsReview
      )
      .subscribe(
        (res) => {
          if (quesForMarkedAsReview.selectedOptions !== null) {
            this.toastrService.success('Question saved successfully', '', this.toasterPostion);
          }
          this.getUserAllSubmissionData();
          if (moveToNext) {
            this.goToNextQuestion();
          }

        },
        (err) => {
          if (String(err.error.apierror.message).includes(
            'already submitted by student'
          )) {
            Swal.fire({
              icon: 'error',
              title: 'Error while saving question !!!',
              text: 'This test is already submitted. You cant save the question after submitting test',
            });
          }
          else {
            this.toastrService.error('Error - ' + err.error.apierror.message, '', this.toasterPostion);
          }
          console.log('Error while making the question for save', err);
        }
      );
  }

  getSelectedOption() {
    // console.log('optionsSelected=>', this.optionsSelected);
    // debugger;
    const optionsSelectedArray = [];
    for (let i = 0; i < this.optionsSelected.length; i++) {
      if (this.optionsSelected[i]) { optionsSelectedArray.push(String(i + 1)); }
    }
    if (optionsSelectedArray.length > 0) {
      console.log(
        'optionsSelectedArray after analyzing boolean array=>',
        optionsSelectedArray
      );
      return optionsSelectedArray;
    } else {
      // console.log('No option selected in getSelectedOption function');
      return null;
    }
    // return null;
    // return this.optionsSelected;
  }

  getPreviousSelectedOption() {
    const optionsSelectedArray = [];
    for (let i = 0; i < this.previousOptionsSelected.length; i++) {
      if (this.previousOptionsSelected[i]) {
        optionsSelectedArray.push(String(i + 1));
      }
    }
    if (optionsSelectedArray.length > 0) {
      return optionsSelectedArray;
    } else {
      return null;
    }
  }

  goToNextQuestion() {
    this.optionsSelected = [];
    this.previousOptionsSelected = [];
    this.timeElapsedInSecond = 0;
    if (this.questionNumber < this.sectionsWithPapers.length - 1) {
      this.questionNumber = this.questionNumber + 1;
      this.currentSelectedQuestion = this.sectionsWithPapers[this.questionNumber];
    } else {
      this.goToNextSection();
      // this.toastrService.error(
      //   'You are already at last question of this section.'
      // );
    }
  }

  goToNextSection() {
    // console.log(
    //   'testData.sections=>',
    //   this.testdata.sections,
    //   ' current sections=>',
    //   ele
    // );
    const tabGroup = this.Tab_Group;
    if (!tabGroup || !(tabGroup instanceof MatTabGroup)) { return; }

    const tabCount = tabGroup._tabs.length;
    if (tabGroup.selectedIndex == tabCount - 1) {
      this.SaveandExit();
      return;
    }
    tabGroup.selectedIndex = (tabGroup.selectedIndex + 1) % tabCount;
    console.log('tabGroup=', tabGroup);
  }


  async getUserAllSubmissionData() {
    await this.testConfigService
      .getSudentSubmissionState(this.assignmentId, this.userName)
      .subscribe(
        (res: any) => {

          //reveiew This
          this.submissionData = res;
          this.optionsSelected = [];
          this.previousOptionsSelected = [];
          this.setTITAQuestionFetchedAns(this.submissionData);
          this.setCurrentQuestionSelectedOption();

          ///
          this.visitedQuestionList = [];
          this.markForReviewQuestionList = [];
          this.answeredQuestionList = [];
          res.sections.forEach(section => {
            section.answers.forEach(answer => {
              if(answer.markForReview){
                this.markForReviewQuestionList.push(answer.questionId);
              } else if((answer.selectedOptions && answer.selectedOptions.length > 0 )|| answer.answerText.length > 0){
                this.answeredQuestionList.push(answer.questionId);
              } else {
                this.visitedQuestionList.push(answer.questionId);
              }
            });
          });

        },
        (error) => {
          console.error(
            'Error in fetching user submitted data => Reasons can be: 1)This user doesn\'t has any submitted data 2). Internet connectivity issue'
          );
         }
      );

  }

  async clearResponse() {
    for (let i = 0; i < this.optionsSelected.length; i++) {
      this.optionsSelected[i] = false;
      this.previousOptionsSelected[i] = false;
    }
    const questionForClearResponse = new QuestionMarkedForReviewModel();
    questionForClearResponse.answerText = null;
    questionForClearResponse.assignmentId = this.assignmentId;
    questionForClearResponse.markForReview = false;
    questionForClearResponse.questionId = this.currentSelectedQuestion.id.questionId;
    questionForClearResponse.sectionId = this.currentSelectedQuestion.sectionId;
    questionForClearResponse.selectedOptions = (this.getSelectedOption() as any);
    questionForClearResponse.timeElapsedInSec = this.timeElapsedInSecond;
    this.testConfigService
      .clearQuestionResponse(this.testId, questionForClearResponse)
      .subscribe(
        (res) => {
          this.toastrService.success('Response cleared successfully');
          this.timeElapsedInSecond = 0;
          this.getUserAllSubmissionData();
        },
        (err) => {
          console.log('Error while clearing response for question', err);
        }
      );
  }

  setTITAQuestionFetchedAns(submittedFetchedData) {
    this.titaText = '';
    if (submittedFetchedData.sections) {
      submittedFetchedData.sections.map((sec) => {
        if (sec.sectionId === this.currentSectionId) {
          sec.answers.map((ans) => {
            if (ans.questionId === this.currentSelectedQuestion?.id.questionId) {
              this.titaText = ans.answerText;
            }
          });
        }
      });
    } else {
      this.titaText = '';
    }
  }

  setCurrentQuestionSelectedOption() {
    const fetchedSubmissionState = this.submissionData;
    fetchedSubmissionState?.sections.map((section) => {
      if (section.sectionId === this.currentSectionId) {
        section.answers.map((ans) => {
          if (ans?.questionId === this.currentSelectedQuestion?.id.questionId) {
            const selectedOptions = ans.selectedOptions;

            this.optionsSelected = [];
            this.previousOptionsSelected = [];
            if (selectedOptions !== null) {
              this.setOptionSelectedAfterFetchingData(selectedOptions);
            }
          }
        });
      }
    });
  }

  setOptionSelectedAfterFetchingData(selected) {

    try {
      selected.map((optIndex) => {
        this.optionsSelected[Number(optIndex) - 1] = true;
        this.previousOptionsSelected[Number(optIndex) - 1] = true;
      });

    } catch (exception) {
      console.log(
        'Error while setting the fetched selected options for current question =>',
        exception
      );
    }
  }

  setOptionSelected(selected) {
    if (
      this.optionsSelected[selected - 1] === true ||
      this.optionsSelected[selected - 1] === false
    ) {
      this.optionsSelected[selected - 1] = !this.optionsSelected[selected - 1];
    } else {
      this.optionsSelected[selected - 1] = true;
    }

  }

  calculate() {
    const dialogRef = this.dialog.open(CalculatorComponent, {
      maxWidth: '450px',
      width: '100%',
      height: 'auto',
    });
  }


  // function called by question number buttons
  async selectQuestion(ques: any, currentQuestionIndex: number) {
    // first save the response on previous question
    if(this.isTestLive){
      this.currentSelectedQuestion.visited = true;
      await this.saveWaitingTime(false);
    }
    this.timeElapsedInSecond = 0;
    // move to the next question
    {
      this.questionNumber = currentQuestionIndex;
      this.optionsSelected = [];
      this.previousOptionsSelected = [];
      this.currentSelectedQuestion = this.sectionsWithPapers.find(
        (x) =>
          x.id.questionId == ques.id.questionId && x.sectionId == ques.sectionId
      );
      if(this.isTestLive){
        this.getUserAllSubmissionData();
      }
    }
  }

  async saveWaitingTime(moveToNext = true) {
    this.isCurrentQuestionMarkedForReview();
    const quesForMarkedAsReview = new QuestionMarkedForReviewModel();
    quesForMarkedAsReview.answerText = this.titaText;
    quesForMarkedAsReview.markForReview = this.getSelectedOption() != null
      || this.titaText != null ? false : true;
    quesForMarkedAsReview.assignmentId = this.assignmentId;
    quesForMarkedAsReview.questionId = this.currentSelectedQuestion.id.questionId;
    quesForMarkedAsReview.sectionId = this.currentSelectedQuestion.sectionId;
    quesForMarkedAsReview.selectedOptions = (this.getSelectedOption() as any);
    quesForMarkedAsReview.timeElapsedInSec = this.timeElapsedInSecond;


    await this.testConfigService
      .saveandNextAnswers(
        quesForMarkedAsReview.assignmentId,
        quesForMarkedAsReview
      )
      .subscribe(
        (res) => {
          if (quesForMarkedAsReview.selectedOptions !== null) {
            this.toastrService.success('Question saved successfully', '', this.toasterPostion);
          }
          this.getUserAllSubmissionData();
          if (moveToNext) {
            this.goToNextQuestion();
          }

        },
        (err) => {
          if (String(err.error.apierror.message).includes(
            'already submitted by student'
          )) {
            Swal.fire({
              icon: 'error',
              title: 'Error while saving question !!!',
              text: 'This test is already submitted. You cant save the question after submitting test',
            });
          }
          else {
            this.toastrService.error('Error - ' + err.error.apierror.message, '', this.toasterPostion);
          }
          console.log('Error while making the question for save', err);
        }
      );
  }


  selectSection(section ) {
    this.currentSectionId = section.id;
    this.optionsSelected = [];
    this.sectionsWithPapers = this.sectionQuestionMap.get(section.id);
    this.currentSelectedSection = section;
    this.currentSelectedQuestion = this.sectionsWithPapers[0];
  }


  changeSection(event) {
    const section = this.testData?.sections[event];

    if(!this.isTestLive){
      this.selectSection(section);
      return;
    }

    if(this.isTestLive){
      this.saveAndNextAnswers(false);
    }

    this.questionNumber = 0;
    this.optionsSelected = [];
    this.previousOptionsSelected = [];
    this.currentSectionId = section.id;
    this.getUserAllSubmissionData();

    if (section != null) {
      this.sectionsWithPapers = this.sections.filter(
        (x) => x.sectionId == section.id
      );

      if (this.sectionsWithPapers.length > 0) {
        this.sectionsWithPapers.forEach((element) => {
          element.color = 'grey';
        });
        this.sectionsWithPapers[0].color = 'green';
      }
      this.currentSelectedQuestion = this.sectionsWithPapers.find(
        (x) =>
          x.id.questionId == this.sectionsWithPapers[0].id.questionId &&
          x.sectionId == section.id
      );
      const submissionfilterdata = this.submissionData?.sections.filter(
        (x) => x.sectionId == section.id
      );
      if (submissionfilterdata?.length > 0) {
        if (submissionfilterdata.length > 0) {
          submissionfilterdata.forEach((sub) => {
            sub.answers.forEach((element) => {
              if (element.markForReview) {
                this.sectionsWithPapers.forEach((element2) => {
                  if (element2.questionId == element.questionId) {
                    element2.color = 'blue';
                  }
                });
              }
            });
          });
        }
      }
    }
  }

  async SaveandExit() {
    await this.saveAndNextAnswers(false);
    Swal.fire({
      title: 'Are you sure?',
      text: 'want to submit test.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#277da1',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Close',
      confirmButtonText: 'Submit',
    }).then((result) => {
      if (result.isConfirmed) {
        this.submitAssessment();
      }
    });
  }

  submitAssessment() {
    this.testConfigService.saveandExit(this.assignmentId).subscribe(
      (res: any) => {
        this.close();
        this.router
          .navigate(['/home/assignment_report/' + this.assignmentId])
          .then(() => console.log('Navigate to score card'))
          .catch((err) =>
            console.log('Error=> Navigate to score card=>', err)
          );
        this.toastrService.success('Test submitted successfully');
      },
      (err) => {
        this.toastrService.error('Test submitted failed. Please try again.');
        console.log('Error while making the question for save', err);
        if (err.status === 400 &&
          err.error.apierror.message === 'Student submission details not found.') {
          this.toastrService.error('No response submitted by you.');
        }
      }
    );
  }

  convertminutestoseconds(value) {
    return Math.floor(value * 60);
  }

  convertSecondstoMinutes(value) {
    return Math.floor(value / 60);
  }

  close() {
    //this.dialogRef.close();
    this.timerSource.unsubscribe();
  }

  setButtonColor(buttonNumber, color, border) {

    this.sectionsWithPapers.map((sec, i) => {
      if (i === buttonNumber) {
        this.sectionsWithPapers[i].color = color;
        this.questionNavigationButtonColorArray[i] = color;
        this.buttonStyle[i] = new ButtonStyleAttributesModel(color, border);
      }
    });
  }

  exit(){
    this.location.back();
  }
}

