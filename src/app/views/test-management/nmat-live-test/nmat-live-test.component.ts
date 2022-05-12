import { Component, OnInit, ChangeDetectionStrategy, HostListener, Inject, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, fromEvent, timer } from 'rxjs';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { MathService } from 'src/app/shared/directives/math/math.service';
import { AppState } from 'src/app/state_management/_states/auth.state';
import Swal from 'sweetalert2';
import { ButtonStyleAttributesModel } from '../../assignments/models/buttonStyleAttributesModel';
import { QuestionMarkedForReviewModel } from '../../assignments/models/questionMarkedForReview';
import { CalculatorComponent } from '../../assignments/popups/calculator/calculator.component';
import { TestConfigService } from '../../assignments/services/test-config-service';
import { VideoPreviewComponent } from '../../questions/video-preview/video-preview.component';
import { DOCUMENT, Location } from '@angular/common';

@Component({
  selector: 'app-nmat-live-test',
  templateUrl: './nmat-live-test.component.html',
  styleUrls: ['./nmat-live-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NmatLiveTestComponent implements OnInit {

  timeSeconds = 0;
  timeElapsedInSecond = 0;
  testId = '';
  selectedTabIndexValue = 0;
  questionNumber = 0;
  buttonStyle: ButtonStyleAttributesModel[] = [];

  isTestSubmittedSuccessFully = false;

  questionNavigationButtonColorArray = [];
  sectionsWithPapers = [];
  appState: any;
  userName = '';
  studentName = '';

  CountDownTimerValue = '--:--:--';
  timerSource;

  assignmentId = '';
  titaText = '';
  toasterPostion = {
    positionClass: 'toast-bottom-right',
  };

  elem: any;

  isLastSectionQuestion = false;

  isFullLengthLastSection = false;

  isSectionTimerTest = false;

  timerStarted = false;

  isLoading = true;

  sectionQuestionMap = new Map<string, any>();

  sectionTotalTimeMap = new Map<string, number>();

  currentSelectedSection: any;

  currentSelectedQuestion: any;

  selectedQuestionCorrectAnswer: string | number;

  selectedQuestionExplanation: string;

  optionsSelected = [];

  singleOptionsSelected = null;

  submissionData: any = null;

  visitedQuestionList: string[] = [];

  answeredQuestionList: string[] = [];

  markForReviewQuestionList: string[] = [];

  selectedTabIndex = new FormControl(0);

  // nativeNavigationSubscriber;

  isSectionChangeTriggered = false;

  @Input() testData;

  @Input() assignmentData;

  @Input() isTestLive = false;

  @ViewChild('TabGroup', { static: false }) Tab_Group: MatTabGroup;

  videoUrl: any;

  onlineEvent: Observable<Event>;
  offlineEvent: Observable<Event>;
  subscriptions: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    private testConfigService: TestConfigService,
    private toastrService: ToastrService,
    private store: Store<AppState>,
    private router: Router,
    public mathService: MathService,
    private location: Location,
    public authorizationService: AuthorizationService,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit(): void {
    this.elem = this.document.documentElement;
    this.isLoading = false;
    this.store.select('appState').subscribe((data) => {
      this.userName = data?.user?.userName;
      this.studentName = data?.user?.firstName + ' ' + data?.user?.lastName;
    });

    this.isSectionTimerTest = this.testData.isSectionTimerTest;

    if (this.isTestLive) {
      this.testId = this.assignmentData.testId;
      this.assignmentId = this.assignmentData.assignmentId;
    } else {
      this.testId = this.testData.questionPaperId;
    }
    this.initialize();
    this.checkInternetConnectivity();
  }

  checkInternetConnectivity() {
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');

    this.subscriptions.push(
      this.offlineEvent.subscribe((e) => {
        Swal.fire({
          icon: 'error',
          title: 'Connection lost! You are not connected to internet!!',
          confirmButtonText: 'Ok',
        }).finally(() => {
          this.subscriptions.forEach((x) => x.unsubscribe());
          this.close();
          this.router
            .navigate(['/home/dashboard'])
            .then(() => console.log('Navigate to score card'))
            .catch((err) =>
              console.log('Error=> Navigate to score card=>', err)
            );
        });
        console.log('Offline...');
      })
    );
  }

  @HostListener('window:beforeunload', ['$event'])
  subscribeToNativeNavigation($event: any) {
    // console.log('close window/tab processing starts');
    $event.preventDefault();
    this.saveAndNextAnswers(false);
    if (confirm('You data is loading. Are you sure you want to leave?')) {
      console.log('You may lose your data if you refresh now');
      if (this.timerSource) {
        this.timerSource.unsubscribe();
        this.timerSource = null;
      }
    }
    $event.returnValue = 'Your changes will be lost.';
    return false;
  }

  initialize() {
    this.testData.sections.forEach((section) => {
      this.sectionTotalTimeMap.set(
        section.id,
        this.convertminutestoseconds(section.durationInMinutes)
      );
    });

    this.testData?.sections?.forEach((section, index) => {
      if (section != null && section.questions != null) {
        // sort question by Sequence
        section.questions.sort((a, b) => {
          if (a.sequenceNumber == 0 && b.sequenceNumber == 0) {
            const passage1 = a.passageContent ? a.passageContent : '';

            const passage2 = b.passageContent ? b.passageContent : '';

            const passageName1 = passage1 + (a.name ? a.name : '');
            const passageName2 = passage2 + (b.name ? b.name : '');
            return passageName1 < passageName2
              ? -1
              : passageName1 > passageName2
              ? 1
              : 0;
          } else {
            return a.sequenceNumber < b.sequenceNumber ? -1 : 1;
          }
        });
        this.sectionQuestionMap.set(section.id, section.questions);
      }
    });

    if (this.isTestLive) {
      this.testConfigService
        .getSudentSubmissionState(this.assignmentId, this.userName)
        .subscribe(
          (submissionData) => {
            this.submissionData = submissionData;

            this.visitedQuestionList = [];
            this.markForReviewQuestionList = [];
            this.answeredQuestionList = [];
            submissionData.sections.forEach((section) => {
              section.answers.forEach((answer) => {
                if (answer.markForReview) {
                  this.markForReviewQuestionList.push(answer.questionId);
                } else if (
                  (answer.selectedOptions &&
                    answer.selectedOptions.length > 0) ||
                  (answer.answerText && answer.answerText.length > 0)
                ) {
                  this.answeredQuestionList.push(answer.questionId);
                } else {
                  this.visitedQuestionList.push(answer.questionId);
                }
              });
            });

            if (this.isSectionTimerTest) {
              const sectionTimeSpendMap = new Map<string, number>();
              this.submissionData.sections.forEach((section) => {
                const timeLapsed = section.answers
                  .map((x) => x.timeElapsedInSec)
                  .reduce((a, b) => a + b);
                sectionTimeSpendMap.set(section.sectionId, timeLapsed);
              });
              let selectSectionId;
              let sectionIndex = -1;
              for (const [key, value] of this.sectionTotalTimeMap.entries()) {
                sectionIndex++;
                selectSectionId = key;
                if (
                  sectionTimeSpendMap.get(key) == undefined ||
                  value >= sectionTimeSpendMap.get(key)
                ) {
                  break;
                }
              }
              this.currentSelectedSection = this.testData.sections.find(
                (x) => x.id == selectSectionId
              );
              this.sectionsWithPapers =
                this.sectionQuestionMap.get(selectSectionId);
              this.selectedTabIndex.setValue(sectionIndex);
              this.timeSeconds = this.getTestTimerValue();
              this.observableTimer(
                sectionTimeSpendMap.get(selectSectionId) != undefined
                  ? sectionTimeSpendMap.get(selectSectionId)
                  : 0
              );
            } else {
              this.currentSelectedSection = this.testData.sections[0];
              this.sectionsWithPapers = this.sectionQuestionMap.get(
                this.currentSelectedSection.id
              );
              this.timeSeconds = this.getTestTimerValue();
              this.observableTimer(
                this.submissionData?.totalTestTimeTakenInSec
              );
            }
            this.getQuestion(0, true);
          },
          (error) => {
            console.log(
              "Error in fetching user submitted data => Reasons can be: 1)This user doesn't has any submitted data"
            );
            this.currentSelectedSection = this.testData.sections[0];
            this.sectionsWithPapers = this.sectionQuestionMap.get(
              this.currentSelectedSection.id
            );
            this.timeSeconds = this.getTestTimerValue();
            this.getQuestion(0, false);
            this.observableTimer(0);
          }
        );
    } else {
      this.currentSelectedSection = this.testData.sections[0];
      this.sectionsWithPapers = this.sectionQuestionMap.get(
        this.currentSelectedSection.id
      );
      this.getQuestion(0, false);
      this.CountDownTimerValue = new Date(this.getTestTimerValue() * 1000)
        .toISOString()
        .substr(11, 8);
      this.timerStarted = true;
    }
  }

  getTestTimerValue() {
    if (this.isSectionTimerTest) {
      return this.convertminutestoseconds(
        this.currentSelectedSection.durationInMinutes
      );
    } else {
      return this.convertminutestoseconds(this.testData.totalDurationInMinutes);
    }
  }

  resetTimer() {
    if (this.timerSource) {
      this.timerSource.unsubscribe();
    }
  }

  observableTimer(totalTestTimeTakenInSec = 0) {
    const source = timer(1000, 1000);
    this.timerSource = source.subscribe((val) => {
      this.timerStarted = true;
      this.timeElapsedInSecond++;
      const leftSecs = this.timeSeconds - val - totalTestTimeTakenInSec;
      if (leftSecs > 0) {
        this.CountDownTimerValue = new Date(leftSecs * 1000)
          .toISOString()
          .substr(11, 8);
      } else if (
        leftSecs == 0 &&
        this.isSectionTimerTest &&
        this.testData.sections.length - 1 != this.selectedTabIndex.value
      ) {
        this.timerSource.unsubscribe();
        Swal.fire({
          icon: 'success',
          title: 'Section Time is Over.Moving to next section!!',
          confirmButtonText: 'Ok',
        }).finally(() => {
          this.selectedTabIndex.setValue(this.selectedTabIndex.value + 1);
        });
      } else if (leftSecs == 0) {
        this.timerSource.unsubscribe();
        this.saveWaitingTime(true);
        Swal.fire({
          icon: 'success',
          title: 'Test Over!!',
          confirmButtonText: 'Ok',
        }).finally(() => {
          this.submitAssessment();
        });
      } else {
        this.timerSource.unsubscribe();
        this.saveWaitingTime(true);
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



  async saveAndNextAnswers(moveToNext = true, changeSection = null) {
    console.log('this.question=>', this.currentSelectedQuestion);

    if (!this.isSectionChangeTriggered) {
      const quesForMarkedAsReview = new QuestionMarkedForReviewModel();
      quesForMarkedAsReview.markForReview =
        this.getSelectedOption() != null || this.titaText != null
          ? false
          : true;
      quesForMarkedAsReview.assignmentId = this.assignmentId;
      quesForMarkedAsReview.questionId =
        this.currentSelectedQuestion.id.questionId;
      quesForMarkedAsReview.sectionId = this.currentSelectedSection.id;
      quesForMarkedAsReview.timeElapsedInSec = this.timeElapsedInSecond;
      quesForMarkedAsReview.answerText = this.titaText;
      quesForMarkedAsReview.selectedOptions = this.getSelectedOption() as any;
      this.timeElapsedInSecond = 0;
      await this.testConfigService
        .saveandNextAnswers(
          quesForMarkedAsReview.assignmentId,
          quesForMarkedAsReview
        )
        .subscribe(
          (res) => {
            if (quesForMarkedAsReview.selectedOptions !== null) {
              this.toastrService.success(
                'Response saved successfully',
                '',
                this.toasterPostion
              );
            }
            if (changeSection) {
              this.optionsSelected = [];
              this.singleOptionsSelected = null;
              this.sectionsWithPapers = this.sectionQuestionMap.get(
                changeSection.id
              );
              this.currentSelectedSection = changeSection;
            }
            this.getUserAllSubmissionData(moveToNext);
          },
          (err) => {
            if (
              String(err.error.apierror.message).includes(
                'already submitted by student'
              )
            ) {
              Swal.fire({
                icon: 'error',
                title: 'Error while saving response !!!',
                text: 'This test is already submitted. You cant save the response after submitting test',
              });
            } else {
              this.toastrService.error(
                'Error - ' + err.error.apierror.message,
                '',
                this.toasterPostion
              );
            }
            console.log('Error while making the response for save', err);
          }
        );
    } else {
      this.isSectionChangeTriggered = false;
      if (changeSection) {
        this.optionsSelected = [];
        this.singleOptionsSelected = null;
        this.sectionsWithPapers = this.sectionQuestionMap.get(changeSection.id);
        this.currentSelectedSection = changeSection;
      }
      this.getUserAllSubmissionData(moveToNext);
    }
  }

  getSelectedOption() {
    const optionsSelectedArray = [];
    if (this.currentSelectedQuestion.type == 'MCQ') {
      if (this.singleOptionsSelected) {
        optionsSelectedArray.push(String(this.singleOptionsSelected.key));
        return optionsSelectedArray;
      }
      return null;
    } else if (this.currentSelectedQuestion.type == 'MCQ_MULTIPLE') {
      for (let i = 0; i < this.optionsSelected.length; i++) {
        if (this.optionsSelected[i]) {
          optionsSelectedArray.push(String(i));
        }
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

    return null;
  }

  goToNextQuestion() {
    this.optionsSelected = [];
    this.singleOptionsSelected = null;
  //  this.timeElapsedInSecond = 0;
    if (this.questionNumber < this.sectionsWithPapers.length - 1) {
      this.questionNumber = this.questionNumber + 1;
      this.getQuestion(this.questionNumber, true);
    } else {
      this.goToNextSection();
    }
  }

  getQuestion(index, setAnswer = false) {
    this.testConfigService
      .getQuestionbyQuestionId(this.currentSelectedSection.questions[index]?.id)
      .subscribe(
        (question) => {
          if (
            !this.isSectionTimerTest &&
            this.questionNumber == this.sectionsWithPapers.length - 1 &&
            this.selectedTabIndexValue == this.sectionQuestionMap.size - 1
          ) {
            this.isFullLengthLastSection = true;
          } else {
            this.isFullLengthLastSection = false;
          }

          if (
            this.questionNumber == this.sectionsWithPapers.length - 1 &&
            this.isSectionTimerTest
          ) {
            this.isLastSectionQuestion = true;
          } else {
            this.isLastSectionQuestion = false;
          }

          if (question.videoExplanationUrl != null) {
            this.videoUrl = question.videoExplanationUrl;
          } else {
            this.videoUrl = null;
          }

          this.currentSelectedQuestion = question;
          this.showCorrectAnswerAndExplanation(question);

          if (setAnswer) {
            this.optionsSelected = [];
            this.singleOptionsSelected = null;
            this.setTITAQuestionFetchedAns(this.submissionData);
            this.setCurrentQuestionSelectedOption();
          }
          this.isLoading = false;
        },
        (error: any) => {
          console.log('Error in fetching question');
        }
      );
  }

  goToNextSection() {
    const tabGroup = this.Tab_Group;
    if (!tabGroup || !(tabGroup instanceof MatTabGroup)) {
      return;
    }

    const tabCount = tabGroup._tabs.length;
    if (tabGroup.selectedIndex == tabCount - 1) {
      this.SaveandExit();
      return;
    }
    this.isSectionChangeTriggered = true;
    tabGroup.selectedIndex = (tabGroup.selectedIndex + 1) % tabCount;
    console.log('tabGroup=', tabGroup);
  }

  async getUserAllSubmissionData(gotoNextQuestion = false) {
    await this.testConfigService
      .getSudentSubmissionState(this.assignmentId, this.userName)
      .subscribe(
        (res: any) => {
          this.submissionData = res;

          this.visitedQuestionList = [];
          this.markForReviewQuestionList = [];
          this.answeredQuestionList = [];
          res.sections.forEach((section) => {
            section.answers.forEach((answer) => {
              if (answer.markForReview) {
                this.markForReviewQuestionList.push(answer.questionId);
              } else if (
                (answer.selectedOptions && answer.selectedOptions.length > 0) ||
                (answer.answerText && answer.answerText.length > 0)
              ) {
                this.answeredQuestionList.push(answer.questionId);
              } else {
                this.visitedQuestionList.push(answer.questionId);
              }
            });
          });
          if (gotoNextQuestion) {
            if (!this.isLastSectionQuestion && !this.isFullLengthLastSection) {
              this.goToNextQuestion();
            }
          } else {
            this.optionsSelected = [];
            this.singleOptionsSelected = null;
            this.setTITAQuestionFetchedAns(this.submissionData);
            this.setCurrentQuestionSelectedOption();
          }
        },
        (error) => {
          console.log(
            "Error in fetching user submitted data => Reasons can be: 1)This user doesn't has any submitted data 2). Internet connectivity issue"
          );
          this.timeSeconds = this.convertminutestoseconds(
            this.currentSelectedSection.durationInMinutes
          );
          this.observableTimer(0);
        }
      );
  }



  setTITAQuestionFetchedAns(submittedFetchedData) {
    this.titaText = '';
    if (submittedFetchedData.sections) {
      submittedFetchedData.sections.map((sec) => {
        if (sec.sectionId === this.currentSelectedSection.id) {
          sec.answers.map((ans) => {
            if (
              ans.questionId === this.currentSelectedQuestion?.id.questionId
            ) {
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
    this.submissionData?.sections.map((section) => {
      if (section.sectionId === this.currentSelectedSection.id) {
        section.answers.map((ans) => {
          if (ans?.questionId === this.currentSelectedQuestion?.id.questionId) {
            const selectedOptions = ans.selectedOptions;
            if (this.currentSelectedQuestion.type === 'MCQ' && selectedOptions !== null) {
              this.singleOptionsSelected =
                this.currentSelectedQuestion.options.find((x) =>
                  selectedOptions.includes(x.key)
                );
            } else {
              this.optionsSelected = [];
              this.singleOptionsSelected = null;
              if (selectedOptions !== null) {
                selectedOptions.map((optIndex) => {
                  this.optionsSelected[Number(optIndex)] = true;
                });
              }
            }
          }
        });
      }
    });
  }

  getCurrentQuestionSubmissionData(){
    let answer = null;
    this.submissionData?.sections.map((section) => {
      if (section.sectionId === this.currentSelectedSection.id) {
        section.answers.map((ans) => {
          if (ans?.questionId === this.currentSelectedQuestion?.id.questionId) {
            answer = ans;
          }
        });
      }
    });
    return answer;
  }

  setOptionSelected(selected) {
    if (
      this.optionsSelected[selected] === true ||
      this.optionsSelected[selected] === false
    ) {
      this.optionsSelected[selected] = !this.optionsSelected[selected];
    } else {
      this.optionsSelected[selected] = true;
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
    if (this.isTestLive) {
      this.currentSelectedQuestion.visited = true;
      this.questionNumber = currentQuestionIndex;
      await this.saveWaitingTime(false);
    } else {
      this.questionNumber = currentQuestionIndex;
      this.optionsSelected = [];
      this.singleOptionsSelected = null;
      await this.testConfigService
        .getQuestionbyQuestionId(
          this.currentSelectedSection.questions[currentQuestionIndex]?.id
        )
        .subscribe(
          (question) => {
            this.currentSelectedQuestion = question;
            this.showCorrectAnswerAndExplanation(question);

            if (question.videoExplanationUrl != null) {
              this.videoUrl = question.videoExplanationUrl;
            } else {
              this.videoUrl = null;
            }
          },
          (err) => {
            this.toastrService.error(
              'Failed to get Question',
              err,
              this.toasterPostion
            );
          }
        );
      if (this.isTestLive) {
        if (
          !this.isSectionTimerTest &&
          this.questionNumber == this.sectionsWithPapers.length - 1 &&
          this.selectedTabIndexValue == this.sectionQuestionMap.size - 1
        ) {
          this.isFullLengthLastSection = true;
        } else {
          this.isFullLengthLastSection = false;
        }
        if (
          this.questionNumber == this.sectionsWithPapers.length - 1 &&
          this.isSectionTimerTest
        ) {
          this.isLastSectionQuestion = true;
        } else {
          this.isLastSectionQuestion = false;
        }
        this.getUserAllSubmissionData(false);
      }
    }
  }

  async saveWaitingTime(showSuccessMsg = true) {
    const quesForMarkedAsReview = new QuestionMarkedForReviewModel();
    quesForMarkedAsReview.answerText = this.titaText;
    quesForMarkedAsReview.markForReview =
      this.getSelectedOption() != null || this.titaText != null ? false : true;
    quesForMarkedAsReview.assignmentId = this.assignmentId;
    quesForMarkedAsReview.questionId =
      this.currentSelectedQuestion.id.questionId;
    quesForMarkedAsReview.sectionId = this.currentSelectedSection.id;
    if(this.submissionData){
      let previousResponse = this.getCurrentQuestionSubmissionData();
      if(previousResponse){
        quesForMarkedAsReview.selectedOptions = previousResponse.selectedOptions;
      } else {
        quesForMarkedAsReview.selectedOptions = [];
      }
    } else {
      quesForMarkedAsReview.selectedOptions = [];
    }
    quesForMarkedAsReview.timeElapsedInSec = this.timeElapsedInSecond;
    this.timeElapsedInSecond = 0;
    await this.testConfigService
      .saveandNextAnswers(
        quesForMarkedAsReview.assignmentId,
        quesForMarkedAsReview
      )
      .subscribe(
        (res) => {
          if (quesForMarkedAsReview.selectedOptions !== null) {
            if(showSuccessMsg){
              this.toastrService.success(
                'Response saved successfully',
                '',
                this.toasterPostion
              );
            }

          }
          if (
            !this.isSectionTimerTest &&
            this.questionNumber === this.sectionsWithPapers.length - 1 &&
            this.selectedTabIndexValue === this.sectionQuestionMap.size - 1
          ) {
            this.isFullLengthLastSection = true;
          } else {
            this.isFullLengthLastSection = false;
          }

          if (
            this.questionNumber === this.sectionsWithPapers.length - 1 &&
            this.isSectionTimerTest
          ) {
            this.isLastSectionQuestion = true;
          } else {
            this.isLastSectionQuestion = false;
          }
          //this.timeElapsedInSecond = 0;
          this.testConfigService
            .getSudentSubmissionState(this.assignmentId, this.userName)
            .subscribe(
              (res: any) => {
                this.submissionData = res;

                this.visitedQuestionList = [];
                this.markForReviewQuestionList = [];
                this.answeredQuestionList = [];
                res.sections.forEach((section) => {
                  section.answers.forEach((answer) => {
                    if (answer.markForReview) {
                      this.markForReviewQuestionList.push(answer.questionId);
                    } else if (
                      (answer.selectedOptions &&
                        answer.selectedOptions.length > 0) ||
                      (answer.answerText && answer.answerText.length > 0)
                    ) {
                      this.answeredQuestionList.push(answer.questionId);
                    } else {
                      this.visitedQuestionList.push(answer.questionId);
                    }
                  });
                });
                this.testConfigService
                  .getQuestionbyQuestionId(
                    this.currentSelectedSection.questions[this.questionNumber]
                      ?.id
                  )
                  .subscribe(
                    (question) => {
                      if (question.videoExplanationUrl != null) {
                        this.videoUrl = question.videoExplanationUrl;
                      } else {
                        this.videoUrl = null;
                      }
                      this.currentSelectedQuestion = question;
                      this.showCorrectAnswerAndExplanation(question);
                      this.optionsSelected = [];
                      this.singleOptionsSelected = null;
                      this.setTITAQuestionFetchedAns(this.submissionData);
                      this.setCurrentQuestionSelectedOption();
                    },
                    (error: any) => {
                      this.toastrService.error(
                        'Error loading question. Please try again.',
                        error,
                        this.toasterPostion
                      );
                    }
                  );
              },
              (error) => {
                console.log(
                  "Error in fetching user submitted data => Reasons can be: 1)This user doesn't has any submitted data 2). Internet connectivity issue"
                );
              }
            );
        },
        (err) => {
          if (
            String(err.error.apierror.message).includes(
              'already submitted by student'
            )
          ) {
            Swal.fire({
              icon: 'error',
              title: 'Error while saving response !!!',
              text: 'This test is already submitted. You cant save the response after submitting test',
            });
          } else {
            this.toastrService.error(
              'Error - ' + err.error.apierror.message,
              '',
              this.toasterPostion
            );
          }
          console.log('Error while making the response for save', err);
        }
      );
  }

  async selectSection(section) {
    this.optionsSelected = [];
    this.singleOptionsSelected = null;
    this.sectionsWithPapers = this.sectionQuestionMap.get(section.id);
    this.currentSelectedSection = section;
    await this.testConfigService
      .getQuestionbyQuestionId(this.currentSelectedSection.questions[0]?.id)
      .subscribe(
        (question) => {
          if (question.videoExplanationUrl != null) {
            this.videoUrl = question.videoExplanationUrl;
          } else {
            this.videoUrl = null;
          }
          this.currentSelectedQuestion = question;
          this.showCorrectAnswerAndExplanation(question);
        },
        (err) => {
          this.toastrService.error(
            'Failed to get Question',
            err,
            this.toasterPostion
          );
        }
      );
  }

  async changeSection(event, sectionTimeSpend = 0) {
    this.selectedTabIndexValue = event;
    const section = this.testData?.sections[event];
    this.questionNumber = -1;
    this.isLastSectionQuestion = false;

    if (!this.isTestLive && this.isSectionTimerTest) {
      this.questionNumber = 0;
      this.timeSeconds = this.convertminutestoseconds(
        section.durationInMinutes
      );
      this.CountDownTimerValue = new Date(this.timeSeconds * 1000)
        .toISOString()
        .substr(11, 8);
      this.selectSection(section);
      return;
    } else if (this.isTestLive && this.isSectionTimerTest) {
      this.timeSeconds = this.convertminutestoseconds(
        section.durationInMinutes
      );
      this.resetTimer();
      this.observableTimer(sectionTimeSpend);
    } else if (!this.isTestLive && !this.isSectionTimerTest) {
      this.questionNumber = 0;
      this.selectSection(section);
      return;
    }

    if (this.isTestLive) {
      this.saveAndNextAnswers(true, section);
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
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.submitAssessment();
        }
      })
      .catch((error) => {
        this.toastrService.error(
          'Error saving response. Please try again',
          error,
          this.toasterPostion
        );
      });
  }

  submitAssessment() {
    this.testConfigService.saveandExit(this.assignmentId).subscribe(
      (res: any) => {
        this.isTestSubmittedSuccessFully = true;
        this.close();
        this.router
          .navigate(['/home/dashboard/assignment_report/' + this.assignmentId])
          .then(() => console.log('Navigate to score card'))
          .catch((err) => console.log('Error=> Navigate to score card=>', err));
        this.toastrService.success('Test submitted successfully');
      },
      (err) => {
        this.toastrService.error('Test submitted failed. Please try again.');
        console.log('Error while making the response for save', err);
        if (
          err.status === 400 &&
          err.error.apierror.message === 'Student submission details not found.'
        ) {
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
    // this.dialogRef.close();
    this.timerSource.unsubscribe();
  }

  exit() {
    this.location.back();
  }

  ngOnDestroy() {
    if (!this.isTestSubmittedSuccessFully) {
      this.saveAndNextAnswers(false);
    }

    if (this.timerSource) {
      this.timerSource.unsubscribe();
      this.timerSource = null;
    }
  }

  showCorrectAnswerAndExplanation(question) {
    if (question?.answer?.options && question?.answer?.options.length > 0) {
      const isStartWithZero = question.options.some((x) => x.key == 0);
      if (isStartWithZero) {
        this.selectedQuestionCorrectAnswer =
          parseInt(question?.answer?.options) + 1;
      } else {
        this.selectedQuestionCorrectAnswer = parseInt(
          question?.answer?.options
        );
      }
    } else {
      this.selectedQuestionCorrectAnswer = question?.answer?.answerText;
    }
    this.selectedQuestionExplanation = question?.explanation;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(VideoPreviewComponent, {
      data: { videoUrl: this.videoUrl },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

}
