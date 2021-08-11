import { E, X } from '@angular/cdk/keycodes';
import { Component, OnInit, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { id } from '@swimlane/ngx-charts';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { AppState } from 'src/app/state_management/_states/auth.state';
import Swal from 'sweetalert2';
import { QuestionMarkedForReviewModel } from '../../models/questionMarkedForReview';
import { TestConfigService } from '../../services/test-config-service';
import { CalculatorComponent } from '../calculator/calculator.component';
import { timer } from 'rxjs';
import { MatTabGroup } from '@angular/material/tabs';
import { ButtonStyleAttributesModel } from '../../models/buttonStyleAttributesModel';

@Component({
  selector: 'app-test-live',
  templateUrl: './test-live.component.html',
  styleUrls: ['./test-live.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TestLiveComponent implements OnInit {
  @ViewChild('TabGroup', { static: false }) Tab_Group: MatTabGroup;
  timeSeconds = 0;
  timeElapsedInSecond = 0;
  testId = '';
  testData: any;

  questionNumber = 0;
  buttonStyle: ButtonStyleAttributesModel[] = [];

  questionNavigationButtonColorArray = [];
  sectionsWithPapers = [];
  question: any;
  sections = [];
  currentSectionId: string;
  optionsSelected = [];
  appState: any;
  userName = '';
  submissionData: any;
  currentSectionSubmittedData: any;
  studentName = '';
  testType = 'preview';
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
  constructor(
    @Inject(MAT_DIALOG_DATA) public _data: any,
    public dialogRef: MatDialogRef<TestLiveComponent>,
    public dialog: MatDialog,
    private testConfigService: TestConfigService,
    private toastrService: ToastrService,
    private store: Store<AppState>,
    private router: Router
  ) {

  }

  ngOnInit(): void {

    this.testType = this._data.testType;
    this.store.select('appState').subscribe((data) => {
      this.userName = data?.user?.userName;
      this.studentName = data?.user?.firstName + ' ' + data?.user?.lastName;
    });
    if (
      this._data.testData.questionPaperId != null &&
      this._data.testData.questionPaperId != undefined
    ) {
      this.testId = this._data.testData.questionPaperId;
    } else {
      this.testId = this._data.testData.testId;
      this.assignmentId = this._data.testData.assignmentId;
    }
    this.getQuestionPaperbyId();
    this.getUserSubmissionData();
  }

  getQuestionPaperbyId() {
    // debugger;
    this.testConfigService
      .getQuestionPaper(this.testId)
      .pipe(finalize(() => { }))
      .subscribe(
        async (res: any) => {
          // debugger;
          this.testData = res;
          this.timeSeconds = this.convertminutestoseconds(
            this.testData.totalDurationInMinutes
          );


          if (res.sections !== null) {
            this.GetQuestionPapers();
          }
          await this.getUserSubmissionData();
          if (this.testType === 'live') {
            this.observableTimer(this.submissionData?.totalTestTimeTakenInSec);
          } else {
            this.CountDownTimerValue = new Date(this.timeSeconds * 1000)
              .toISOString()
              .substr(11, 8);
          }
        },
        (error) => {
          this.toastrService.error(
            error?.error?.message ? error?.error?.message : error?.message,
            'Error', this.toasterPostion
          );
        }
      );
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
    quesForMarkedAsReview.answerText = this.question.name;
    quesForMarkedAsReview.markForReview = true;
    quesForMarkedAsReview.assignmentId = this.assignmentId;
    quesForMarkedAsReview.questionId = this.question.id.questionId;
    quesForMarkedAsReview.sectionId = this.question.sectionId;
    quesForMarkedAsReview.selectedOptions = (this.getSelectedOption() as any);
    quesForMarkedAsReview.timeElapsedInSec = this.timeElapsedInSecond;
    console.log(
      'questionMarkedForReview object=>',
      quesForMarkedAsReview,
      ' current question => ',
      this.question
    );
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
          this.getUserSubmissionData();
          this.goToNextQuestion();
        },
        (err) => console.log('Error while making the question for review', err)
      );
  }

  isCurrentQuestionMarkedForReview() {

    let marked = false;
    this.sectionsWithPapers.map((sec, i) => {
      if (sec.id.questionId === this.question.id.questionId) {
        if (this.buttonStyle[i].background === 'orange') {
          marked = true;
        }
      }
    });
    console.log('The prev question was marked?=>', marked);
    return marked;
  }

  async saveAndNextAnswers(moveToNext = true) {
    if (this.testType === 'preview'){
      return;
    }
    console.log('this.question=>', this.question);
    this.isCurrentQuestionMarkedForReview();
    const quesForMarkedAsReview = new QuestionMarkedForReviewModel();
    quesForMarkedAsReview.answerText = this.titaText;
    quesForMarkedAsReview.markForReview = this.getSelectedOption() != null
      || this.titaText != null ? false : true;
    quesForMarkedAsReview.assignmentId = this.assignmentId;
    quesForMarkedAsReview.questionId = this.question.id.questionId;
    quesForMarkedAsReview.sectionId = this.question.sectionId;
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
          this.getUserSubmissionData();
          if (moveToNext) {
            this.goToNextQuestion();
          }

        },
        (err) => {
          if (String(err.message).includes(
            'already submitted by student'
          )) {
            Swal.fire({
              icon: 'error',
              title: 'Error while saving question !!!',
              text: 'This test is already submitted. You cant save the question after submitting test',
            });
          }
          else {
            this.toastrService.error('Error - ' + err.message, '', this.toasterPostion);
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

  goToNextQuestion() {
    this.optionsSelected = [];
    this.timeElapsedInSecond = 0;
    if (this.questionNumber < this.sectionsWithPapers.length - 1) {
      this.questionNumber = this.questionNumber + 1;
      this.question = this.sectionsWithPapers[this.questionNumber];
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

  async getUserSubmissionData() {
    if(this.testType !== 'preview'){
    await this.testConfigService
      .getSudentSubmissionState(this.assignmentId, this.userName)
      .subscribe(
        (res: any) => {
          this.submissionData = res;
          this.optionsSelected = [];
          this.setTITAQuestionFetchedAns(this.submissionData);
          this.setCurrentQuestionSelectedOption();
          this.setColoursForQuestionNavigationButtons();
        },
        (error) => {
          console.error('Error in fetching user submitted data => Reasons can be: 1)This user doesn\'t has any submitted data 2). Internet connectivity issue'
          );
          this.setColoursForQuestionNavigationButtons();
        }
      );
      }
  }

  async clearResponse() {
    for (let i = 0; i < this.optionsSelected.length; i++) {
      this.optionsSelected[i] = false;
    }
    const questionForClearResponse = new QuestionMarkedForReviewModel();

    questionForClearResponse.answerText = null;
    questionForClearResponse.assignmentId = this.assignmentId;
    questionForClearResponse.markForReview = false;
    questionForClearResponse.questionId = this.question.id.questionId;
    questionForClearResponse.sectionId = this.question.sectionId;
    questionForClearResponse.selectedOptions = (this.getSelectedOption() as any);
    questionForClearResponse.timeElapsedInSec = this.timeElapsedInSecond;
    this.testConfigService
      .clearQuestionResponse(this.testId, questionForClearResponse)
      .subscribe(
        (res) => {
          console.log('Responses cleared for this question', res);
          this.toastrService.success('Response cleared successfully');
          this.timeElapsedInSecond = 0;
          this.getUserSubmissionData();
          this.setColoursForQuestionNavigationButtons();
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
            if (ans.questionId === this.question?.id.questionId) {
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
          if (ans?.questionId === this.question?.id.questionId) {
            const selectedOptions = ans.selectedOptions;

            this.optionsSelected = [];
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

  GetQuestionPapers() {
    if (this.testData?.sections.length > 0) {
      const sections = this.testData?.sections;
      console.log('Current Sections => ', sections);
      if (sections != null) {
        sections.forEach((tempSection) => {
          if (tempSection != null && tempSection.questions != null) {
            tempSection.questions.forEach((sectionQuestion) => {
              if (sectionQuestion != null) {
                const checkData = this.sectionsWithPapers.find(
                  (x) => x.id.questionId === sectionQuestion.id
                );
                if (checkData == null) {
                  this.testConfigService
                    .getQuestionbyQuestionId(sectionQuestion?.id)
                    .subscribe(
                      (res: any) => {
                        // debugger;
                        res.sectionId = tempSection.id;
                        res.iscolorActive = false;
                        res.ismarked = false;
                        res.sequenceNumber = sectionQuestion.sequenceNumber;
                        this.sections.push(res);
                        this.sections[0].iscolorActive = true;
                        this.selectSection1(this.sections[0].sectionId);
                        this.question = this.sections[0];
                        this.setCurrentQuestionSelectedOption();
                        this.setColoursForQuestionNavigationButtons();
                        // this.setColoursForQuestionNavigationButtons();
                        // console.log('this.sections==', this.sections);
                      },
                      (error) => {
                        this.toastrService.error(
                          error?.error?.message
                            ? error?.error?.message
                            : error?.message
                          , '', this.toasterPostion
                        );
                      }
                    );
                }
              }
            });
          }
        });
      }
    }
  }

  // function called by question number buttons
  async getQuestion(ques: any, currentQuestionIndex: number) {
    // first save the response on previous question
    await this.saveAndNextAnswers(false);
    this.timeElapsedInSecond = 0;
    // move to the next question
    {
      this.questionNumber = currentQuestionIndex;
      this.optionsSelected = [];
      this.question = this.sectionsWithPapers.find(
        (x) =>
          x.id.questionId == ques.id.questionId && x.sectionId == ques.sectionId
      );
      this.sectionsWithPapers.forEach((element) => {
        if (ques.id.questionId == element.id.questionId) {
          element.iscolorActive = true;
        } else {
          element.iscolorActive = false;
        }
      });

      this.getUserSubmissionData();
      this.setColoursForQuestionNavigationButtons();
    }
  }

  selectSection1(id: string = '') {
    this.currentSectionId = id;
    this.optionsSelected = [];
    this.setCurrentQuestionSelectedOption();
    this.setColoursForQuestionNavigationButtons();
    this.sectionsWithPapers = this.sections.filter((x) => x.sectionId == id);
    this.sortQuestions();
    if (this.sectionsWithPapers.length > 0) {
      this.sectionsWithPapers.forEach((element) => {
        element.color = 'grey';
      });
      this.sectionsWithPapers[0].color = 'green';
    }
    const submissionfilterdata = this.submissionData?.sections.filter(
      (x) => x.sectionId == id
    );
    this.currentSectionSubmittedData = this.submissionData?.sections.filter(
      (x) => x.sectionId == id
    );

    this.setColoursForQuestionNavigationButtons();
  }



  // on click of switch sections tab buttons

  setColoursForQuestionNavigationButtons() {

    const colorAppliedIndexesArray = [];
    // prepare color array with all false
    this.sectionsWithPapers.map((sec, i) => {

      this.setButtonColor(i, 'grey', 'none');
    });
    // debugger;
    this.submissionData?.sections.map((section) => {
      if (section.sectionId === this.currentSectionId) {
        this.currentSectionSubmittedData = section.answers;
      }
    });

    if (this.sectionsWithPapers?.length > 0) {
      this.sectionsWithPapers.map((ques, i) => {
        // this.currentSectionSubmittedData will always be a array of length 1 0r 0
        if (this.currentSectionSubmittedData) {
          this.currentSectionSubmittedData.map((sub_ans) => {


            // All comparisions will be done between ques and sub_ans
            if (ques.id.questionId === sub_ans.questionId) {
              if (sub_ans.markForReview) {
                if (!colorAppliedIndexesArray[i]) {
                  // set color orange
                  if (ques.id.questionId === this.question?.id.questionId) {
                    this.setButtonColor(i, 'orange', 'green');
                  }
                  else { this.setButtonColor(i, 'orange', 'none'); }
                  colorAppliedIndexesArray[i] = true;
                }
              } else if (
                sub_ans.selectedOptions !== null ||
                (sub_ans.answerText !== null && sub_ans.answerText !== '')
              ) {
                if (!colorAppliedIndexesArray[i]) {
                  if (ques.id.questionId === this.question?.id.questionId) {
                    this.setButtonColor(i, '#2596be', 'green');
                  }
                  else { this.setButtonColor(i, '#2596be', 'none'); }
                  colorAppliedIndexesArray[i] = true;
                }
              } else {
                // the ques is in sub_data but not marked for review and
                // not current question too so set grey
                if (!colorAppliedIndexesArray[i]) {
                  // set color grey
                  // this.setButtonColor(i, 'grey');
                  if (ques.id.questionId === this.question?.id.questionId) {
                    this.setButtonColor(i, 'grey', 'green');
                  }
                  else { this.setButtonColor(i, 'grey', 'none'); }
                  colorAppliedIndexesArray[i] = true;
                }
              }
              // }
            }
          });
        }
      });

      this.sectionsWithPapers.map((ques, i) => {
        // this.currentSectionSubmittedData will always be a array of length 1 0r 0
        if (this.currentSectionSubmittedData) {
          this.currentSectionSubmittedData.map((sub_ans) => {

            if (!colorAppliedIndexesArray[i]) {
              // set color green
              // this.setButtonColor(i, 'green');
              if (ques.id.questionId === this.question?.id.questionId) {
                this.setButtonColor(i, 'grey', 'green');
              }
              else { this.setButtonColor(i, 'grey', 'none'); }
              colorAppliedIndexesArray[i] = true;
            }

          });
        }
      });

      //
    }

    this.sectionsWithPapers.map((ques, i) => {


      if (!colorAppliedIndexesArray[i]) {
        // set color grey
        // this.setButtonColor(i, 'grey');
        if (ques.id.questionId === this.question?.id.questionId) {
          this.setButtonColor(i, 'grey', 'green');
        }
        else { this.setButtonColor(i, 'grey', 'none'); }
        colorAppliedIndexesArray[i] = true;
      }
    });

    this.sectionsWithPapers.map((sec, i) => {
      colorAppliedIndexesArray[i] = false;
    });
  }

  selectSection(event) {
    this.saveAndNextAnswers(false);
    // debugger;
    this.questionNumber = 0;
    const section = this.testData?.sections.find(
      (x) => x.name == event.tab.textLabel
    );
    console.log('Currect section object =>', section);
    this.optionsSelected = [];
    this.currentSectionId = section.id;
    this.getUserSubmissionData();

    if (section != null) {
      this.sectionsWithPapers = this.sections.filter(
        (x) => x.sectionId == section.id
      );
      this.sortQuestions();
      if (this.sectionsWithPapers.length > 0) {
        this.sectionsWithPapers.forEach((element) => {
          element.color = 'grey';
        });
        this.sectionsWithPapers[0].color = 'green';
      }
      this.question = this.sectionsWithPapers.find(
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
                    element2.ismarked = true;
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
    this.dialogRef.close();
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

  sortQuestions(){
    if (this.sectionsWithPapers && this.sectionsWithPapers.length > 0){
      this.sectionsWithPapers.sort((a, b) =>
        {
          if (a.sequenceNumber ){
            return a.sequenceNumber - b.sequenceNumber;
          }

          const passage1 = a.passageContent ? a.passageContent : '';

          const passage2 = b.passageContent ? b.passageContent : '';

          const passageName1 = passage1 + (a.name ? a.name : '');
          const passageName2 = passage2 + (b.name ? b.name : '');
          return (passageName1 < passageName2 ? -1 : (passageName1 > passageName2 ? 1 : 0));
        
      });
    }
    return this.sectionsWithPapers;
  }

}
