import { E } from '@angular/cdk/keycodes';
import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { AppState } from 'src/app/state_management/_states/auth.state';
import Swal from 'sweetalert2';
import { QuestionMarkedForReviewModel } from '../../models/questionMarkedForReview';
import { TestConfigService } from '../../services/test-config-service';
import { CalculatorComponent } from '../calculator/calculator.component';

@Component({
  selector: 'app-test-live',
  templateUrl: './test-live.component.html',
  styleUrls: ['./test-live.component.css'],
})
export class TestLiveComponent implements OnInit {
  timeSeconds: number = 0;
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
  userType : string ="";
  constructor(
    @Inject(MAT_DIALOG_DATA) public _data: any,
    public dialogRef: MatDialogRef<TestLiveComponent>,
    public dialog: MatDialog,
    private testConfigService: TestConfigService,
    private toastrService: ToastrService,
    private store: Store<AppState>,
    private router : Router
  ) {}

  ngOnInit(): void {
    // //debugger;
    this.store.select('appState').subscribe((data) => {
      this.userName = data.user.userName;
      this.studentName = data.user.firstName + ' ' + data.user.lastName;
      this.userType = data?.user?.authorities[0]?.authority;
      console.log('data', data);
    });
    this.testid = this._data.testData.questionPaperId;
    this.timeSeconds = this.convertminutestoseconds(
      this._data?.testData?.totalDurationInMinutes
    );
    this.getQuestionPaperbyId();
    this.getUserSubmissionData();
  }

  async setQuestionAsMarkerdForReview() {
    const quesForMarkedAsReview = new QuestionMarkedForReviewModel();
    quesForMarkedAsReview.answerText = null;
    quesForMarkedAsReview.markForReview = true;
    quesForMarkedAsReview.assignmentId = this._data.testData.questionPaperId;
    quesForMarkedAsReview.questionId = this.question.id.questionId;
    quesForMarkedAsReview.sectionId = this.question.sectionId;
    quesForMarkedAsReview.selectedOptions = [this.getSelectedOption()];
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
    quesForMarkedAsReview.assignmentId = this._data.testData.questionPaperId;
    quesForMarkedAsReview.questionId = this.question.id.questionId;
    quesForMarkedAsReview.sectionId = this.question.sectionId;
    quesForMarkedAsReview.selectedOptions = [this.getSelectedOption()];
    quesForMarkedAsReview.timeElapsedInSec = this.timeSeconds;
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
        (err) => console.log('Error while making the question for save', err)
      );
  }

  goToNextQuestion() {
    if (this.currentQuestionIndex < this.sectionsWithPapers.length - 1) {
      this.currentQuestionIndex = this.currentQuestionIndex + 1;
      this.question = this.sectionsWithPapers[this.currentQuestionIndex];
    } else {
      this.toastrService.error('You are already at last question');
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
        this.testConfigService
          .saveandExit(this._data.testData.questionPaperId)
          .subscribe(
            (res : any) => {
              this.toastrService.success('Test submitted successfully');
              this.close();
              this.router.navigate(['/home/tests/show-result/' + this._data.testData.questionPaperId]);
            },
            (err) =>
              console.log('Error while making the question for save', err)
          );
      }
    });
  }

  async getUserSubmissionData() {
    await this.testConfigService
      .getSudentSubmissionState(
        this._data.testData.questionPaperId,
        this.userName
      )
      .subscribe(
        (res: any) => {
          this.submissionData = res;
          console.log(
            'this.submissionData',
            this.submissionData,
            ' current question=>',
            this.question
          );
          this.setCurrentQuestionSelectedOption();
          this.setColoursForQuestionNavigationButtons();
          // this.setColoursForQuestionNavigationButtons();
        },
        (error) => {
          this.toastrService.error(
            error?.error?.message ? error?.error?.message : error?.message,
            'Error'
          );
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
    questionForClearResponse.assignmentId = this._data.testData.questionPaperId;
    questionForClearResponse.markForReview = false;
    questionForClearResponse.questionId = this.question.id.questionId;
    questionForClearResponse.sectionId = this.question.sectionId;
    questionForClearResponse.selectedOptions = [this.getSelectedOption()];
    questionForClearResponse.timeElapsedInSec = this.timeSeconds;
    console.log('questionForClearResponse object=>', questionForClearResponse);
    await this.testConfigService
      .clearQuestionResponse(
        this._data.testData.questionPaperId,
        questionForClearResponse
      )
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

  getSelectedOption() {
    //console.log('optionsSelected=>', this.optionsSelected);
    for (var i = 0; i < this.optionsSelected.length; i++) {
      if (this.optionsSelected[i]) return String(i + 1);
    }
    return null;
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
    // console.log('Inside the setting current selected option function');
    // console.log('we are in the section id =>', this.currentSectionId);
    fetchedSubmissionState?.sections.map((section) => {
      // console.log('Section inside fetched state =>', section.sectionId);
      if (section.sectionId === this.currentSectionId) {
        section.answers.map((ans) => {
          // console.log('answers in the section=>', ans);
          // console.log('ans.questionId in the section=>', ans.questionId);
          // console.log('current question=>', this.question?.id.questionId);
          if (ans?.questionId === this.question?.id.questionId) {
            try {
              if (ans?.options[0] !== null)
                this.setOptionSelectedAfterFetchingData(Number(ans.options[0]));
              else this.setOptionSelectedAfterFetchingData(0);
            } catch {
              console.log('No option selected');
              this.setOptionSelectedAfterFetchingData(0);
            }
          }
        });
      }
    });
  }

  setOptionSelectedAfterFetchingData(selected) {
    // console.log(
    //   'this.sectionWithPapers for button color setting',
    //   this.sectionsWithPapers
    // );
    this.optionsSelected = [];
    if (selected === 0) {
      for (var i = 0; i < this.question?.options.length; i++) {
        this.optionsSelected[i] = false;
      }
    } else {
      for (var i = 0; i < this.question?.options.length; i++) {
        if (i != selected - 1) this.optionsSelected[i] = false;
      }
      this.optionsSelected[selected - 1] = true;
    }
    // console.log(
    //   'Setting Option Selected acc to fetched data=>',
    //   selected,
    //   'options selected=>',
    //   this.optionsSelected
    // );
  }

  setOptionSelected(selected) {
    this.optionsSelected = [];
    for (var i = 0; i < this.question?.options.length; i++) {
      if (i != selected) this.optionsSelected[i] = false;
    }
    this.optionsSelected[selected] = true;
    console.log(
      'Option Selected by user =>',
      selected,
      'options selected=>',
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

  getQuestionPaperbyId() {
    //debugger;
    this.testConfigService
      .getQuestionPaper(this.testid)
      .pipe(finalize(() => {}))
      .subscribe(
        (res: any) => {
          this.testdata = res;
          console.log('this.testdata==', res);
          this.GetQuestionPapers();
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

    console.log('question =>', this.question);
  }

  // getNextQuestion(ques: any) {
  //   //debugger;
  //   this.question = this.sectionsWithPapers.find(
  //     (x) =>
  //       x.id.questionId == ques.id.questionId && x.sectionId == ques.sectionId
  //   );
  //   this.sectionsWithPapers.forEach((element) => {
  //     if (ques.id.questionId == element.id.questionId) {
  //       element.iscolorActive = true;
  //     } else {
  //       element.iscolorActive = false;
  //     }
  //   });

  //   this.getUserSubmissionData();

  //   console.log('question =>', this.question);
  // }

  // getactiveRandomColorStatus(value) {
  //   //debugger;
  //   if (value == true) {
  //     return value != '' ? 'green' : 'green';
  //   } else {
  //     return value != '' ? 'grey' : 'grey';
  //   }

  //   // //debugger;
  //   // if (value == "Not Created") {
  //   //   return value != "" ? "grey" : "grey";
  //   // }
  //   // if (value == "In-Progress") {
  //   //   return value != "" ? "blue" : "blue";
  //   // }
  //   // if (value == "Rejected") {
  //   //   return value != "" ? "red" : "red";
  //   // }
  //   // if (value == true) {
  //   //   return value != "" ? "green" : "green";
  //   // }
  // }

  // getmarkedRandomColorStatus(value = true) {
  //   if (value === true) {
  //     return value ? 'blue' : 'blue';
  //   } else {
  //     return value ? 'blue' : 'blue';
  //   }
  //   // //debugger;
  //   // if (value == "Not Created") {
  //   //   return value != "" ? "grey" : "grey";
  //   // }
  //   // if (value == "In-Progress") {
  //   //   return value != "" ? "blue" : "blue";
  //   // }
  //   // if (value == "Rejected") {
  //   //   return value != "" ? "red" : "red";
  //   // }
  //   // if (value == true) {
  //   //   return value != "" ? "green" : "green";
  //   // }
  // }

  selectSection1(id: string = '') {
    console.log('Current section id =>', id);
    this.currentSectionId = id;
    // this.currentQuestionIndex = 0;
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
    console.log(' setColoursForQuestionNavigationButtons called');
    console.log(
      ' this.sectionsWithPapers =>',
      this.sectionsWithPapers,
      'this.currentSectionSubmittedData =>',
      this.currentSectionSubmittedData,
      ' submissionData=>',
      this.submissionData,
      ' currentSectionId=>',
      this.currentSectionId
    );
    var colorAppliedIndexesArray = [];
    //prepare color array with all false
    this.sectionsWithPapers.map((sec, i) => {
      colorAppliedIndexesArray[i] = false;
      this.questionNavigationButtonColorArray[i] = 'grey';
    });
    debugger;
    this.submissionData?.sections.map((section) => {
      if (section.sectionId === this.currentSectionId) {
        this.currentSectionSubmittedData = section.answers;
      }
    });

    if (this.sectionsWithPapers?.length > 0) {
      this.sectionsWithPapers.map((ques, i) => {
        //this.currentSectionSubmittedData will always be a array of length 1 0r 0

        this.currentSectionSubmittedData.map((sub_ans) => {
          //console.log('524 line sub_data=>', sub_ans);

          // All comparisions will be done between ques and sub_ans
          if (ques.id.questionId == sub_ans.questionId) {
            //if current ques status /data is submitted then apply colors
            //if its current question then green else
            if (ques.id.questionId === this.question?.id.questionId) {
              //the ques is current question
              console.log(
                'current green color question is =>',
                this.question?.name
              );
              if (!colorAppliedIndexesArray[i]) {
                //set color green
                this.setButtonColor(i, 'green');
                colorAppliedIndexesArray[i] = true;
              }
            } else {
              //current ques is in saved data
              //check if mark for review is true then orange else grey
              if (sub_ans.markForReview) {
                if (!colorAppliedIndexesArray[i]) {
                  //set color orange
                  this.setButtonColor(i, 'orange');
                  colorAppliedIndexesArray[i] = true;
                }
              } else if (sub_ans.options !== null) {
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
        this.currentSectionSubmittedData.map((sub_ans) => {
          // console.log('524 line sub_data=>', sub_ans);

          //current ques is not in saved data so apply button color
          //green if its current ques
          //grey if not current ques
          if (ques.id.questionId === this.question?.id.questionId) {
            //the ques is current question
            console.log(
              'current green color question is =>',
              this.question?.name
            );
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
    }

    // this.sectionsWithPapers.map((sec, i) => {
    //   this.currentSectionSubmittedData.map((c_sec, j) => {
    //     c_sec.answers.map((ans_saved, k) => {
    //       // debugger;
    //       if (sec.id.questionId === ans_saved.questionId) {
    //         //if questions submitted then change color buttons acc to state
    //         if (this.currentQuestionIndex !== i) {
    //           if (ans_saved.markForReview === true) {
    //             console.log(
    //               'question index ',
    //               i,
    //               ' is marked for review , current questionIndex =>',
    //               this.currentQuestionIndex,
    //               ' colorAppliedIndexesArray =>',
    //               colorAppliedIndexesArray,
    //               ' currentSectionSubmittedData=>',
    //               this.currentSectionSubmittedData
    //             );
    //             if (colorAppliedIndexesArray[i] === false) {
    //               // this.setButtonColor(i, 'orange');
    //               console.log(
    //                 'For color orange in 1st if question index ',
    //                 i,
    //                 ' is marked for review , current questionIndex =>',
    //                 this.currentQuestionIndex,
    //                 ' colorAppliedIndexesArray =>',
    //                 colorAppliedIndexesArray,
    //                 ' currentSectionSubmittedData=>',
    //                 this.currentSectionSubmittedData
    //               );
    //               this.setButtonColor(i, 'orange');
    //               colorAppliedIndexesArray[i] = true;
    //             }
    //           }
    //         } else {
    //           if (colorAppliedIndexesArray[i] === false) {
    //             this.setButtonColor(i, 'green');
    //             colorAppliedIndexesArray[i] = true;
    //           }
    //         }
    //       } else {
    //         //if questions not in submitted database
    //         if (this.currentQuestionIndex == i) {
    //           if (colorAppliedIndexesArray[i] === false) {
    //             this.setButtonColor(i, 'green');
    //             colorAppliedIndexesArray[i] = true;
    //           }
    //         } //else if (ans_saved.markForReview === true) {
    //         //   console.log(
    //         //     'For color orange in 2nd if question index ',
    //         //     i,
    //         //     ' is marked for review , current questionIndex =>',
    //         //     this.currentQuestionIndex,
    //         //     ' colorAppliedIndexesArray =>',
    //         //     colorAppliedIndexesArray,
    //         //     ' currentSectionSubmittedData=>',
    //         //     this.currentSectionSubmittedData
    //         //   );
    //         //   this.setButtonColor(i, 'orange');
    //         //   colorAppliedIndexesArray[i] = true;
    //         // }
    //         else if (
    //           colorAppliedIndexesArray[i] === false &&
    //           ans_saved.markForReview === false
    //         ) {
    //           this.setButtonColor(i, 'grey');
    //           colorAppliedIndexesArray[i] = true;
    //         }
    //       }
    //     });
    //   });
    // });

    this.sectionsWithPapers.map((sec, i) => {
      colorAppliedIndexesArray[i] = false;
    });
  }

  //on click of switch sections tab buttons
  selectSection(event) {
    //debugger;
    var section = this.testdata?.sections.find(
      (x) => x.name == event.tab.textLabel
    );
    console.log('Currect section object =>', section);
    // this.setColoursForQuestionNavigationButtons();
    this.currentSectionId = section.id;
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
  }

  setButtonColor(buttonNumber?, color?) {
    console.log(
      'SetButton color is called with  sectionsWithPapers=>',
      this.sectionsWithPapers,
      ' index=>',
      buttonNumber,
      ' color=>',
      color
    );

    this.sectionsWithPapers.map((sec, i) => {
      if (i === buttonNumber) {
        this.sectionsWithPapers[i].color = color;
        this.questionNavigationButtonColorArray[i] = color;
      }
    });
  }
}
