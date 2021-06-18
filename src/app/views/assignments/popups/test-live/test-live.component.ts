import { E } from '@angular/cdk/keycodes';
import { Component, OnInit, Inject } from '@angular/core';
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

@Component({
  selector: 'app-test-live',
  templateUrl: './test-live.component.html',
  styleUrls: ['./test-live.component.css'],
})
export class TestLiveComponent implements OnInit {
  timeSeconds: number = 0;
  timeElapsedInSecond: number = 0;
  testid: string = '';
  testdata: any;

  currentQuestionIndex: number = 0;
  questionNavigationButtonColorArray = [];
  sectionsWithPapers = [];
  question: any;
  sections = [];
  currentSectionId: string;
  optionsSelected = [];
  appState: any;
  userName: string = '';
  submissionData: any;
  currentSectionSubmittedData: any;
  studentName: string = '';
  userType: string = '';
  // scrollbar
  disabled = false;
  compact = false;
  invertX = false;
  invertY = false;
  CountDownTimerValue: string = '--:--:--';
  timerSource;
  shown: 'native' | 'hover' | 'always' = 'native';
  assignmentId: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public _data: any,
    public dialogRef: MatDialogRef<TestLiveComponent>,
    public dialog: MatDialog,
    private testConfigService: TestConfigService,
    private toastrService: ToastrService,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    // //debugger;
    this.store.select('appState').subscribe((data) => {
      this.userName = data.user.userName;
      this.studentName = data.user.firstName + ' ' + data.user.lastName;
      this.userType = data?.user?.authorities[0]?.authority;
      console.log('data', data, ' userType=>', this.userType);
    });
    if (
      this._data.testData.questionPaperId != null &&
      this._data.testData.questionPaperId != undefined
    ) {
      this.testid = this._data.testData.questionPaperId;
    } else {
      this.testid = this._data.testData.testId;
      this.assignmentId = this._data.testData.assignmentId;
    }
    this.getQuestionPaperbyId();
    this.getUserSubmissionData();
  }

  getQuestionPaperbyId() {
    //debugger;
    this.testConfigService
      .getQuestionPaper(this.testid)
      .pipe(finalize(() => {}))
      .subscribe(
        (res: any) => {
          this.testdata = res;
          this.timeSeconds = this.convertminutestoseconds(
            this.testdata.totalDurationInMinutes
          );
          if (this.userType === 'ROLE_STUDENT') this.observableTimer();
          else
            this.CountDownTimerValue = new Date(this.timeSeconds * 1000)
              .toISOString()
              .substr(11, 8);
          console.log(
            'this.testdata==',
            res,
            ' this.testdata.timeSeconds=',
            this.timeSeconds
          );
          if (res.sections !== null) this.GetQuestionPapers();
          //  if (res.isSuccess) {

          // }
        },
        (error) => {
          this.toastrService.error(
            error?.error?.message ? error?.error?.message : error?.message,
            'Error'
          );
        }
      );
  }

  observableTimer() {
    const source = timer(1000, 1000);
    this.timerSource = source.subscribe((val) => {
      //console.log(val, '-');
      this.timeElapsedInSecond++;
      var leftSecs = this.timeSeconds - val;
      if (leftSecs > 0)
        this.CountDownTimerValue = new Date(leftSecs * 1000)
          .toISOString()
          .substr(11, 8);
      else if (leftSecs == 0) {
        this.timerSource.unsubscribe();
        Swal.fire({
          icon: 'success',
          title: 'Test Duration Completed',
        }).finally(() => {
          this.testConfigService.saveandExit(this.testid).subscribe(
            (res: any) => {
              this.toastrService.success('Test submitted successfully');
              this.close();
              this.router.navigate(['/home/tests/show-result/' + this.testid]);
            },
            (err) =>
              console.log('Error while making the question for save', err)
          );
        });
      }
    });
  }

  async setQuestionAsMarkerdForReview() {
    const quesForMarkedAsReview = new QuestionMarkedForReviewModel();
    quesForMarkedAsReview.answerText = null;
    quesForMarkedAsReview.markForReview = true;
    quesForMarkedAsReview.assignmentId = this.assignmentId;
    quesForMarkedAsReview.questionId = this.question.id.questionId;
    quesForMarkedAsReview.sectionId = this.question.sectionId;
    quesForMarkedAsReview.selectedOptions = <any>this.getSelectedOption();
    quesForMarkedAsReview.timeElapsedInSec = this.timeSeconds;
    console.log(
      'questionMarkedForReview object=>',
      quesForMarkedAsReview,
      ' current question => ',
      this.question
    );
    await this.testConfigService
      .setQuestionAsMarkedForReview(
        quesForMarkedAsReview.assignmentId,
        quesForMarkedAsReview
      )
      .subscribe(
        (res) => {
          this.toastrService.success(
            'Question is successfully marked for review'
          );
          this.getUserSubmissionData();
        },
        (err) => console.log('Error while making the question for review', err)
      );
  }

  async SaveandNextAnswers() {
    const quesForMarkedAsReview = new QuestionMarkedForReviewModel();
    quesForMarkedAsReview.answerText = null;
    quesForMarkedAsReview.markForReview = false;
    quesForMarkedAsReview.assignmentId = this.assignmentId;
    quesForMarkedAsReview.questionId = this.question.id.questionId;
    quesForMarkedAsReview.sectionId = this.question.sectionId;
    quesForMarkedAsReview.selectedOptions = <any>this.getSelectedOption();
    quesForMarkedAsReview.timeElapsedInSec = this.timeElapsedInSecond;
    console.log(
      'Save and next => questionSaveAndNext object=>',
      quesForMarkedAsReview
    );
    await this.testConfigService
      .saveandNextAnswers(
        quesForMarkedAsReview.assignmentId,
        quesForMarkedAsReview
      )
      .subscribe(
        (res) => {
          this.toastrService.success('Question saved successfully');
          this.getUserSubmissionData();
          this.goToNextQuestion();
        },
        (err) => {
          if (
            String(err.error.apierror.message).includes(
              'already submitted by student'
            )
          )
            Swal.fire({
              icon: 'error',
              title: 'Error while saving question !!!',
              text: 'This test is already submitted. You cant save the question after submitting test',
            });
          else
            this.toastrService.error('Error - ' + err.error.apierror.message);
          console.log('Error while making the question for save', err);
        }
      );
  }
  getSelectedOption() {
    // console.log('optionsSelected=>', this.optionsSelected);
    // debugger;
    var optionsSelectedArray = [];
    for (var i = 0; i < this.optionsSelected.length; i++) {
      if (this.optionsSelected[i]) optionsSelectedArray.push(String(i+1));
    }
    if (optionsSelectedArray.length > 0) {
      console.log(
        'optionsSelectedArray after analyzing boolean array=>',
        optionsSelectedArray
      );
      return optionsSelectedArray;
    } else {
      console.log('No option selected in getSelectedOption function');
      return null;
    }
    // return null;
    // return this.optionsSelected;
  }

  goToNextQuestion() {
    this.optionsSelected = [];
    if (this.currentQuestionIndex < this.sectionsWithPapers.length - 1) {
      this.currentQuestionIndex = this.currentQuestionIndex + 1;
      this.question = this.sectionsWithPapers[this.currentQuestionIndex];
    } else {
      this.toastrService.error(
        'You are already at last question of this section.'
      );
    }
  }

  SaveandExit() {
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
          (err) => console.log('Error while making the question for save', err)
        );
      }
    });
  }

  async getUserSubmissionData() {
    //debugger;
    await this.testConfigService
      .getSudentSubmissionState(this.assignmentId, this.userName)
      .subscribe(
        (res: any) => {
          this.submissionData = res;
          console.log(
            'this.submissionData',
            this.submissionData,
            ' current question=>',
            this.question
          );
          this.optionsSelected = [];
          this.setCurrentQuestionSelectedOption();
          this.setColoursForQuestionNavigationButtons();
          // this.setColoursForQuestionNavigationButtons();
        },
        (error) => {
          // this.toastrService.error(
          //   error?.error?.message ? error?.error?.message : error?.message,
          //   'Error while fetching user submitted data : '
          // );
          console.error(
            "Error in fetching user submitted data => Reasons can be: 1)This user doesn't has any submitted data 2). Internet connectivity issue"
          );
          this.setColoursForQuestionNavigationButtons();
        }
      );
    // this.testConfigService
    //   .getSudentSubmissionState(
    //     this._data.testData.questionPaperId,
    //     this.userName
    //   )
    //   .subscribe(
    //     (res) => this.submissionData = res,
    //     (err) => console.log('Error while making the question for review', err)
    //   );
    //   console.log("this.submissionData==",this.submissionData);
  }

  async clearResponse() {
    console.log('current question=>', this.question);
    for (var i = 0; i < this.optionsSelected.length; i++) {
      this.optionsSelected[i] = false;
    }
    const questionForClearResponse = new QuestionMarkedForReviewModel();

    questionForClearResponse.answerText = null;
    questionForClearResponse.assignmentId = this.assignmentId;
    questionForClearResponse.markForReview = false;
    questionForClearResponse.questionId = this.question.id.questionId;
    questionForClearResponse.sectionId = this.question.sectionId;
    questionForClearResponse.selectedOptions = <any>this.getSelectedOption();
    questionForClearResponse.timeElapsedInSec = this.timeSeconds;
    console.log('questionForClearResponse object=>', questionForClearResponse);
    await this.testConfigService
      .clearQuestionResponse(this.testid, questionForClearResponse)
      .subscribe(
        (res) => {
          console.log('Responses cleared for this question', res);
          this.toastrService.success('Response cleared successfully'),
            this.getUserSubmissionData();
          this.setColoursForQuestionNavigationButtons();
        },
        (err) => {
          console.log('Error while clearing response for question', err);
        }
      );
  }

  // setCurrentQuestionNumberButtonColor(questionNumberIndex: number) {
  //   this.sectionsWithPapers.map((sec, i) => {
  //     if (i == questionNumberIndex) this.sectionsWithPapers[i].color = 'green';
  //   });
  //   this.changeColorIn_sectionWithPapers_Array(questionNumberIndex);
  // }

  // isColorAppliedToThisIndex(index) {
  //   if(this.colorAppliedIndexesArray[index])
  // }

  setCurrentQuestionSelectedOption() {
    const fetchedSubmissionState = this.submissionData;
    //console.log('Inside the setting current selected option function');
    //console.log('we are in the section id =>', this.currentSectionId);
    fetchedSubmissionState?.sections.map((section) => {
      //console.log('Section inside fetched state =>', section.sectionId);
      //section match
      if (section.sectionId === this.currentSectionId) {
        section.answers.map((ans) => {
          //console.log('answers in the section=>', ans);
          //console.log('ans.questionId in the section=>', ans.questionId);
          //console.log('current question=>', this.question?.id.questionId);
          //current question match
          if (ans?.questionId === this.question?.id.questionId) {
            // try {
            //   if (ans?.options[0] !== null)
            //     this.setOptionSelectedAfterFetchingData(Number(ans.options[0]));
            //   else this.setOptionSelectedAfterFetchingData(0);
            // } catch {
            //   console.log('No option selected');
            //   this.setOptionSelectedAfterFetchingData(0);
            // }
            var selectedOptions = ans.selectedOptions;
            // console.log(
            //   'Fethched selectedOptions for the current question =>',
            //   selectedOptions
            // );
            this.optionsSelected = [];
            if (selectedOptions !== null) {
              //ans?.selectOptions is an array
              this.setOptionSelectedAfterFetchingData(selectedOptions);
            }
          }
        });
      }
    });
  }

  setOptionSelectedAfterFetchingData(selected) {
    console.log(
      'Fethched selectedOptions for the current question passed to function =>',
      selected
    );
    try {
      selected.map((optIndex) => {
        this.optionsSelected[Number(optIndex)] = true;
      });
      console.log(
        'After settingt the fetched selectedOptions , this.selectedOptions =>',
        this.optionsSelected
      );
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
    console.log(
      'Option Selected by user =>',
      selected,
      ' , options selected=>',
      this.optionsSelected
    );
  }

  calculate() {
    const dialogRef = this.dialog.open(CalculatorComponent, {
      maxWidth: '500px',
      width: '100%',
      height: 'auto',
    });
  }

  GetQuestionPapers() {
    if (this.testdata?.sections.length > 0) {
      var sections = this.testdata?.sections;
      console.log('Current Sections => ', sections);
      if (sections != null) {
        sections.forEach((element) => {
          if (element != null && element.questions != null) {
            element.questions.forEach((element2) => {
              if (element2 != null) {
                var checkdata = this.sectionsWithPapers.find(
                  (x) => x.id.questionId == element2.id
                );
                if (checkdata == null) {
                  this.testConfigService
                    .getQuestionbyQestionId(element2?.id)
                    .subscribe(
                      (res: any) => {
                        res.sectionId = element.id;
                        res.iscolorActive = false;
                        res.ismarked = false;
                        this.sections.push(res);
                        this.sections[0].iscolorActive = true;
                        this.selectSection1(this.sections[0].sectionId);
                        this.question = this.sections[0];
                        this.setCurrentQuestionSelectedOption();
                        this.setColoursForQuestionNavigationButtons();
                        // this.setColoursForQuestionNavigationButtons();
                        //console.log('this.sections==', this.sections);
                      },
                      (error) => {
                        this.toastrService.error(
                          error?.error?.message
                            ? error?.error?.message
                            : error?.message,
                          'Error'
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

  //function called by question number buttons
  getQuestion(ques: any, currentQuestionIndex: number) {
    //debugger;
    this.currentQuestionIndex = currentQuestionIndex;
    this.optionsSelected = [];
    // this.setCurrentQuestionNumberButtonColor(currentQuestionIndex);
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

    console.log('question =>', this.question);
  }

  selectSection1(id: string = '') {
    console.log('Current section id =>', id);
    this.currentSectionId = id;
    // this.currentQuestionIndex = 0;
    this.optionsSelected = [];
    this.setCurrentQuestionSelectedOption();
    this.setColoursForQuestionNavigationButtons();
    this.sectionsWithPapers = this.sections.filter((x) => x.sectionId == id);

    if (this.sectionsWithPapers.length > 0) {
      this.sectionsWithPapers.forEach((element) => {
        element.color = 'grey';
      });
      this.sectionsWithPapers[0].color = 'green';
    }
    var submissionfilterdata = this.submissionData?.sections.filter(
      (x) => x.sectionId == id
    );
    this.currentSectionSubmittedData = this.submissionData?.sections.filter(
      (x) => x.sectionId == id
    );

    this.setColoursForQuestionNavigationButtons();
  }

  setColoursForQuestionNavigationButtons() {
    // console.log(' setColoursForQuestionNavigationButtons called');
    // console.log(
    //   ' this.sectionsWithPapers =>',
    //   this.sectionsWithPapers,
    //   'this.currentSectionSubmittedData =>',
    //   this.currentSectionSubmittedData,
    //   ' submissionData=>',
    //   this.submissionData,
    //   ' currentSectionId=>',
    //   this.currentSectionId
    // );
    var colorAppliedIndexesArray = [];
    //prepare color array with all false
    this.sectionsWithPapers.map((sec, i) => {
      colorAppliedIndexesArray[i] = false;
      this.questionNavigationButtonColorArray[i] = 'grey';
    });
    //debugger;
    this.submissionData?.sections.map((section) => {
      if (section.sectionId === this.currentSectionId) {
        this.currentSectionSubmittedData = section.answers;
      }
    });

    if (this.sectionsWithPapers?.length > 0) {
      this.sectionsWithPapers.map((ques, i) => {
        //this.currentSectionSubmittedData will always be a array of length 1 0r 0
        if (this.currentSectionSubmittedData)
          this.currentSectionSubmittedData.map((sub_ans) => {
            //console.log('524 line sub_data=>', sub_ans);

            // All comparisions will be done between ques and sub_ans
            if (ques.id.questionId == sub_ans.questionId) {
              //if current ques status /data is submitted then apply colors
              //if its current question then green else
              if (ques.id.questionId === this.question?.id.questionId) {
                //the ques is current question
                // console.log(
                //   'current green color question is =>',
                //   this.question?.name
                // );
                if (!colorAppliedIndexesArray[i]) {
                  //set color green
                  this.setButtonColor(i, 'green');
                  colorAppliedIndexesArray[i] = true;
                }
              } else {
                //current ques is in saved data
                //check if mark for review is true then orange else if answered then blue else grey
                if (sub_ans.markForReview && sub_ans.selectedOptions !== null) {
                  if (!colorAppliedIndexesArray[i]) {
                    //set color violet
                    this.setButtonColor(i, 'violet');
                    colorAppliedIndexesArray[i] = true;
                  }
                } else if (sub_ans.markForReview) {
                  if (!colorAppliedIndexesArray[i]) {
                    //set color orange
                    this.setButtonColor(i, 'orange');
                    colorAppliedIndexesArray[i] = true;
                  }
                } else if (sub_ans.selectedOptions !== null) {
                  if (!colorAppliedIndexesArray[i]) {
                    //set color grey
                    this.setButtonColor(i, 'lightblue');
                    colorAppliedIndexesArray[i] = true;
                  }
                } else {
                  //the ques is in sub_data but not marked for review and
                  //not current question too so set grey
                  if (!colorAppliedIndexesArray[i]) {
                    //set color grey
                    this.setButtonColor(i, 'grey');
                    colorAppliedIndexesArray[i] = true;
                  }
                }
              }
            }
          });
      });

      this.sectionsWithPapers.map((ques, i) => {
        //this.currentSectionSubmittedData will always be a array of length 1 0r 0
        if (this.currentSectionSubmittedData)
          this.currentSectionSubmittedData.map((sub_ans) => {
            // console.log('524 line sub_data=>', sub_ans);

            //current ques is not in saved data so apply button color
            //green if its current ques
            //grey if not current ques
            if (ques.id.questionId === this.question?.id.questionId) {
              //the ques is current question
              // console.log(
              //   'current green color question is =>',
              //   this.question?.name
              // );
              if (!colorAppliedIndexesArray[i]) {
                //set color green
                this.setButtonColor(i, 'green');
                colorAppliedIndexesArray[i] = true;
              }
            } else {
              //current ques is in saved data
              //check if mark for review is true then orange else grey

              //the ques is in sub_data but not marked for review and
              //not current question too so set grey
              if (!colorAppliedIndexesArray[i]) {
                //set color grey
                this.setButtonColor(i, 'grey');
                colorAppliedIndexesArray[i] = true;
              }
            }
          });
      });

      this.sectionsWithPapers.map((ques, i) => {
        //this.currentSectionSubmittedData will always be a array of length 1 0r 0

        // console.log('524 line sub_data=>', sub_ans);

        //current ques is not in saved data so apply button color
        //green if its current ques
        //grey if not current ques
        if (ques.id.questionId === this.question?.id.questionId) {
          //the ques is current question
          // console.log(
          //   'current green color question is =>',
          //   this.question?.name
          // );
          if (!colorAppliedIndexesArray[i]) {
            //set color green
            this.setButtonColor(i, 'green');
            colorAppliedIndexesArray[i] = true;
          }
        } else {
          //current ques is in saved data
          //check if mark for review is true then orange else grey

          //the ques is in sub_data but not marked for review and
          //not current question too so set grey
          if (!colorAppliedIndexesArray[i]) {
            //set color grey
            this.setButtonColor(i, 'grey');
            colorAppliedIndexesArray[i] = true;
          }
        }
      });
    }

    this.sectionsWithPapers.map((sec, i) => {
      colorAppliedIndexesArray[i] = false;
    });
  }

  //on click of switch sections tab buttons
  selectSection(event) {
    //debugger;
    this.currentQuestionIndex = 0;
    var section = this.testdata?.sections.find(
      (x) => x.name == event.tab.textLabel
    );
    console.log('Currect section object =>', section);
    this.optionsSelected = [];
    // this.setColoursForQuestionNavigationButtons();
    this.currentSectionId = section.id;
    this.getUserSubmissionData();

    if (section != null) {
      this.sectionsWithPapers = this.sections.filter(
        (x) => x.sectionId == section.id
      );
      console.log(
        'this.sectionsWithPapers initially =>',
        this.sectionsWithPapers
      );
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
      var submissionfilterdata = this.submissionData?.sections.filter(
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

  setButtonColor(buttonNumber?, color?) {
    // console.log(
    //   'SetButton color is called with  sectionsWithPapers=>',
    //   this.sectionsWithPapers,
    //   ' index=>',
    //   buttonNumber,
    //   ' color=>',
    //   color
    // );

    this.sectionsWithPapers.map((sec, i) => {
      if (i === buttonNumber) {
        this.sectionsWithPapers[i].color = color;
        this.questionNavigationButtonColorArray[i] = color;
      }
    });
  }
}
