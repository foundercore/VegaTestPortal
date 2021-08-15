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
import { DOCUMENT, Location } from '@angular/common';
import { Inject } from '@angular/core';
import { FormControl } from '@angular/forms';

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
  studentName = '';

  CountDownTimerValue = '--:--:--';
  timerSource;

  assignmentId = '';
  titaText = '';
  toasterPostion = {
    positionClass: 'toast-bottom-right'
  };

  elem: any;

  isSectionTimerTest = false;

  timerStarted = false;

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

  selectedTabIndex = new FormControl(0);

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
    private location: Location,
    @Inject(DOCUMENT) private document: any
  ) {

  }

  ngOnInit(): void {
    this.elem = this.document.documentElement;
    this.isSectionTimerTest = this.testData.isSectionTimerTest;

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
    }else {
      this.CountDownTimerValue = new Date(this.timeSeconds * 1000) .toISOString().substr(11, 8);
      this.isLoading = false;
    }
  }

  initializeQuestion() {

    if(this.isSectionTimerTest){
      this.timeSeconds = this.convertminutestoseconds( this.testData.sections[0].durationInMinutes);
    } else {
      this.timeSeconds = this.convertminutestoseconds( this.testData.totalDurationInMinutes);
    }

    if (this.testData.sections !== null) {
      this.getQuestionPapers();
    }
  }

  getQuestionPapers() {
    this.testData?.sections?.forEach((section,index) => {
      if (section != null && section.questions != null) {
        // sort question by Sequence
        section.questions.sort((a, b) =>
          a.sequenceNumber < b.sequenceNumber ? -1 : 1
        );

        section.questions.map(question => {
          question['sectionId'] = section.id;
          return question;
        })
        this.sections = this.sections.concat(section.questions);
        this.sectionQuestionMap.set(section.id,section.questions);
        if(index == 0 ){
          this.selectSection(section);
        }
        if(this.isTestLive){
          this.setCurrentQuestionSelectedOption();
        }
      }
    });
  }


  observableTimer(totalTestTimeTakenInSec = 0) {
    const source = timer(1000, 1000);
    this.timerSource = source.subscribe((val) => {
      this.isLoading = false;
      this.timeElapsedInSecond++;
      const leftSecs = this.timeSeconds - val - totalTestTimeTakenInSec;
      if (leftSecs > 0) {
        this.CountDownTimerValue = new Date(leftSecs * 1000)
          .toISOString()
          .substr(11, 8);

      }
      else if(leftSecs == 0 && this.isSectionTimerTest && this.testData.sections.length - 1 != this.selectedTabIndex.value) {
        this.timerSource.unsubscribe();
        Swal.fire({
          icon: 'success',
          title: 'Section Time is Over.Moving to next section!!',
          confirmButtonText: 'Ok',
        }).finally(() => {
          this.selectedTabIndex.setValue(this.selectedTabIndex.value + 1);
          this.changeSection(this.selectedTabIndex.value + 1,0);
        });
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
    quesForMarkedAsReview.sectionId = this.currentSectionId;
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
    quesForMarkedAsReview.sectionId = this.currentSectionId;
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
            this.toastrService.success('Response saved successfully', '', this.toasterPostion);
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
              title: 'Error while saving response !!!',
              text: 'This test is already submitted. You cant save the response after submitting test',
            });
          }
          else {
            this.toastrService.error('Error - ' + err.error.apierror.message, '', this.toasterPostion);
          }
          console.log('Error while making the response for save', err);
        }
      );
  }

  getSelectedOption() {
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
      return null;
    }
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
      this.getQuestion(this.questionNumber);
    } else {
      this.goToNextSection();
    }
  }

   getQuestion(index){
    this.testConfigService.getQuestionbyQuestionId(this.currentSelectedSection.questions[index]?.id).subscribe(question => this.currentSelectedQuestion = question);
  }

  goToNextSection() {
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
          this.submissionData = res;

         this.setTimer();

          //reveiew This
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
          console.log(
            'Error in fetching user submitted data => Reasons can be: 1)This user doesn\'t has any submitted data 2). Internet connectivity issue'
          );
          this.timeSeconds = this.convertminutestoseconds( this.currentSelectedSection.durationInMinutes);
          this.observableTimer(0);
         }
      );

  }


  setTimer(){
    if(!this.timerStarted){
      if(this.isSectionTimerTest){
        let sectionTimeSpendMap = new Map<string,number>();
        let sectionTotalTimeMap =  new Map<string,number>();
        this.submissionData.sections.forEach(section => {
                let timeLapsed = section.answers.map(x => x.timeElapsedInSec).reduce((a, b) => a + b);
                sectionTimeSpendMap.set(section.sectionId,timeLapsed);
        });

        this.testData.sections.forEach(section => {
            sectionTotalTimeMap.set(section.id,this.convertminutestoseconds(section.durationInMinutes));
        });
        let selectSectionId;
        let sectionIndex = -1;
        for (const [key, value] of sectionTimeSpendMap.entries()) {
          sectionIndex++;
          if(value < sectionTotalTimeMap.get(key))
          {
            selectSectionId = key;
            break;
          }
        }

        // selectSectionId = "9fd1742d-ba9c-46dd-ac4d-61eab91b0e89";
        // sectionIndex = 1;

        if(this.currentSectionId != selectSectionId){
          this.isLoading = false;
          this.selectedTabIndex.setValue(sectionIndex);
          this.changeSection(sectionIndex,sectionTimeSpendMap.get(selectSectionId));
        } else {
          this.observableTimer(sectionTimeSpendMap.get(selectSectionId));
        }
      }else{
        this.observableTimer(this.submissionData?.totalTestTimeTakenInSec);
      }
      this.timerStarted = true;
    }
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
    questionForClearResponse.sectionId = this.currentSectionId;
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
      await this.testConfigService.getQuestionbyQuestionId(this.currentSelectedSection.questions[currentQuestionIndex]?.id).subscribe(
        question => this.currentSelectedQuestion = question,
        (err)=>{
          this.toastrService.error(
          'Failed to get Question', err, this.toasterPostion
            )
         }
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
    quesForMarkedAsReview.sectionId = this.currentSectionId;
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
            this.toastrService.success('Response saved successfully', '', this.toasterPostion);
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
              title: 'Error while saving response !!!',
              text: 'This test is already submitted. You cant save the response after submitting test',
            });
          }
          else {
            this.toastrService.error('Error - ' + err.error.apierror.message, '', this.toasterPostion);
          }
          console.log('Error while making the response for save', err);
        }
      );
  }


  async selectSection(section ) {
    this.currentSectionId = section.id;
    this.optionsSelected = [];
    this.sectionsWithPapers = this.sectionQuestionMap.get(section.id);
    this.currentSelectedSection = section;
    await this.testConfigService.getQuestionbyQuestionId(this.currentSelectedSection.questions[0]?.id).subscribe(
      question => this.currentSelectedQuestion = question,
      (err)=>{
        this.toastrService.error(
        'Failed to get Question', err, this.toasterPostion
          )
       }
      );
  }


  async changeSection(event,sectionTimeSpend?) {
    const section = this.testData?.sections[event];
    this.questionNumber = 0;

    if(!this.isTestLive){
      this.timeSeconds = this.convertminutestoseconds( section.durationInMinutes);
      this.CountDownTimerValue = new Date(this.timeSeconds * 1000) .toISOString().substr(11, 8);
      this.selectSection(section);
      return;
    } else if(this.isTestLive && this.isSectionTimerTest){
      this.timeSeconds = this.convertminutestoseconds( section.durationInMinutes);
      this.observableTimer(sectionTimeSpend);
    }

    if(this.isTestLive){
      this.saveAndNextAnswers(false);
    }

    if (section != null) {
      this.optionsSelected = [];
      this.previousOptionsSelected = [];
      this.currentSectionId = section.id;
      this.getUserAllSubmissionData();
      this.sectionsWithPapers = this.sectionQuestionMap.get(section.id);
      this.currentSelectedSection = section;
      await this.testConfigService.getQuestionbyQuestionId(this.currentSelectedSection.questions[0]?.id).subscribe(question =>
        {
          this.currentSelectedQuestion = question;
          if (this.sectionsWithPapers.length > 0) {
            this.sectionsWithPapers.forEach((element) => {
              element.color = 'grey';
            });
            this.sectionsWithPapers[0].color = 'green';
          }
          const submissionfilterdata = this.submissionData?.sections.filter( (x) => x.sectionId == section.id);
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
        ,
        (err)=>{
          this.toastrService.error(
          'Failed to get Question', err.error.apierror.message, this.toasterPostion
            )
         }
       );
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
          .navigate(['/home/dashboard/assignment_report/' + this.assignmentId])
          .then(() => console.log('Navigate to score card'))
          .catch((err) =>
            console.log('Error=> Navigate to score card=>', err)
          );
        this.toastrService.success('Test submitted successfully');
      },
      (err) => {
        this.toastrService.error('Test submitted failed. Please try again.');
        console.log('Error while making the response for save', err);
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

  exit(){
    this.location.back();
  }

  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }

}

