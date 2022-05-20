import { Section } from './../models/sections';
import { MatDialog } from '@angular/material/dialog';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SectionComponent } from '../popups/section/section.component';
import { TestconfigComponent } from '../popups/test-config/test-config.component';
import { QuestionslistComponent } from '../popups/questions-list/questions-list.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TestConfigService } from '../services/test-config-service';
import { ToastrService } from 'ngx-toastr';
import { TestConfigurationVM } from '../models/test-configuration';
import Swal from 'sweetalert2';
import { SelectionModel } from '@angular/cdk/collections';
import { EditSectionComponent } from '../popups/edit-section/edit-section.component';
import { QuestionModel } from 'src/app/models/questions/question-model';
import { RejectstatusComponent } from '../popups/reject-status/reject-status.component';
import { TestVM } from '../models/postTestVM';
import { Status } from '../models/statusEnum';
import { EditTestComponent } from '../popups/edit-test/edit-test.component';
import { EditTestMetaData } from '../models/editTestMetaData';
import { Location } from '@angular/common';
import { BreadcrumbNavService } from '../../layout/breadcrumb/breadcrumb-nav.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { X } from '@angular/cdk/keycodes';
import { repeat } from 'rxjs/operators';

@Component({
  selector: 'app-update-test-content',
  templateUrl: './update-test-content.component.html',
  styleUrls: ['./update-test-content.component.css'],
})
export class UpdateTestContentComponent implements OnInit {

  public sectionQuestionList = [];

  totalNumberOfRecords = 0;
  currentOpenedSection = new Section();
  panelOpenState: boolean = false;
  modelsections: any = ([] = []);
  section = new Section();
  ques = [];
  testId: string = '';
  controlparms: TestConfigurationVM;

  selection = new SelectionModel<QuestionModel>(true, []);
  testStages: {name:string,status?:number}[] = [
    {name:'Draft',status:-1},
    {name:'Pending Verification',status:-1},
    {name:'Verified',status:-1},
    {name:'Published',status:-1},
  ];

  displayedColumns: string[] = [
    'select',
    'name',
    'negative',
    'positive',
    'skip',
  ];
  ListOfQuestions_Added_In_All_Sections = [];
  totalTestDuration: number = 0;
  totalDurationOfSections: number = 0;
  sectionId: string = '';
  searchText: string = '';
  ques2 = [];
  questionPaper = new EditTestMetaData();
  quest: any;
  status: string;
  type:string;
  expandedStateArray = [];
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  actualTotalNumberOfRecords: any;
  remarks: string = '';
  breadcrumModified: boolean;
  filter = '';
  typeList = [];

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private testConfigService: TestConfigService,
    private toastrService: ToastrService,
    private router: Router,
    private location: Location,
    private breadcrumbNavService: BreadcrumbNavService
  ) {
    this.testConfigService.getQuestionPaperType().subscribe(types => this.typeList = types);

  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.testId = this.route.snapshot.paramMap.get('id');
    this.getQuestionPaperbyId();
  }

  addSection() {
    const dialogRef = this.dialog.open(SectionComponent, {
      maxWidth: '500px',
      width: '100%',
      height: 'auto',
      hasBackdrop: false,
      backdropClass: 'dialog-backdrop',
      data: { testId: this.route.snapshot.paramMap.get('id') },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        let model = new Section();
        model.durationInMinutes = +result?.duration;
        model.name = result?.sectionName;
        model.testId = this.route.snapshot.paramMap.get('id');
        debugger;
        this.testConfigService.addSection(model).subscribe(
          (res: string = '') => {
            this.getQuestionPaperbyId();
            this.toastrService.success('Section added successfully');
          },
          (error) => {
            if (error.status == 200) {
              this.getQuestionPaperbyId();
              this.toastrService.success('Section added successfully');
            } else {
              this.toastrService.error(
                error?.error?.message ? error?.error?.message : error?.message,
                'Error'
              );
            }
          }
        );
      }
    });
  }

  editSection(event,section: Section) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(EditSectionComponent, {
      maxWidth: '700px',
      width: '100%',
      height: 'auto',
      hasBackdrop: false,
      backdropClass: 'dialog-backdrop',
      data: {
        section: section,
        testId: this.testId,
        questionPaper: this.questionPaper,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Result accepted from edit-section dialog box =>', result);
      console.log(
        'Details rreq for edit => this.testId=>',
        this.testId,
        ' this.sectionId=>',
        this.sectionId
      );
      if (result != null) {
        let model = new Section();
        model.durationInMinutes = +result?.duration;
        model.name = result?.sectionName;
        model.instructions = result?.instructions;
        model.difficultyLevel = result?.difficultyLevel;
        model.testId = this.route.snapshot.paramMap.get('id');
        var sectionId = result?.sectionId;
        this.testConfigService
          .editSection(model.testId, sectionId, model)
          .subscribe(
            (res: string = '') => {
              this.getQuestionPaperbyId();
              this.toastrService.success('Section updated successfully');
            },
            (error) => {
              if (error.status == 200) {
                this.getQuestionPaperbyId();
                this.toastrService.success('Section updated successfully');
              } else {
                this.toastrService.error(
                  error?.error?.message
                    ? error?.error?.message
                    : error?.message,
                  'Error'
                );
              }
            }
          );
      }
    });
  }

  editTest() {
    console.log(
      'Edit test testId=>',
      this.testId,
      ' this.questionPaper=>',
      this.questionPaper
    );
    const dialogRef = this.dialog.open(EditTestComponent, {
      maxWidth: '700px',
      width: '100%',
      height: 'auto',
      hasBackdrop: false,
      backdropClass: 'dialog-backdrop',
      data: {
        testId: this.testId,
        questionPaper: this.questionPaper,
        typeList: this.typeList
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Result accepted from edit-test dialog box =>', result);
      this.getQuestionPaperbyId();
    });
  }

  deleteQuestionFromSection() {
    var sectionId = this.section.id;
    var testId = this.testId;
    console.log(
      'Delete question from section =>',
      sectionId,
      ' from testId=>',
      testId,
      ' selections=>',
      this.selection
    );
    var deleteQuestionIdArray = [];
    this.selection.selected.map((sel) => {
      console.log('Sel=>', sel);
      deleteQuestionIdArray.push(sel.id);
    });
    console.log('DeleteQuestionIdArray=>', deleteQuestionIdArray);

    if (deleteQuestionIdArray.length > 0) {
      this.testConfigService
        .deleteQuestionFromSection(testId, sectionId, deleteQuestionIdArray)
        .subscribe(
          (res) => {
            this.getQuestionPaperbyId();
            this.toastrService.success(
              'Selected Questions deleted successfully'
            );
            this.selection = new SelectionModel<QuestionModel>(true, []);
          },
          (err) => {
            this.getQuestionPaperbyId();
            this.toastrService.error(
              'Error while deleting questions=>' + err.error.apierror.message
            );
            console.log(
              'Error while deleting=>',
              deleteQuestionIdArray,
              ' with err=>',
              err
            );
          }
        );
    } else {
      this.toastrService.error(
        'Please select the questions you want to delete'
      );
    }
  }

  viewAssignment() {
    this.router.navigate([
      'home/tests/update-test/' + this.testId + '/view-assignment',
    ]);
  }

  isAllSelected() {
    if (this.sectionQuestionList) {
      const numSelected = this.selection.selected.length;
      const numRows = this.sectionQuestionList?.length;
      return numSelected === numRows;
    }
    return false;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.sectionQuestionList.forEach((row) => this.selection.select(row));
  }

  openTestConfigDialog() {
    const dialogRef = this.dialog.open(TestconfigComponent, {
      maxWidth: '1200px',
      width: '100%',
      height: 'auto',
      hasBackdrop: false,
      backdropClass: 'dialog-backdrop',
      data: {
        testId: this.route.snapshot.paramMap.get('id'),
        controlParms: this.controlparms,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  openQuestionList() {
    const dialogRef = this.dialog.open(QuestionslistComponent, {
      maxWidth: '1300px',
      width: '100%',
      height: 'auto',
      hasBackdrop: false,
      backdropClass: 'dialog-backdrop',
      data: {
        testId: this.route.snapshot.paramMap.get('id'),
        section: this.section,
        selectedques: this.ListOfQuestions_Added_In_All_Sections,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getQuestionPaperbyId();
    });
  }

  getQuestionPaperbyId() {
    if (this.route.snapshot.paramMap.get('id') != null) {
      this.testConfigService
        .getQuestionPaper(this.route.snapshot.paramMap.get('id'))
        .subscribe((res: any) => {
          this.type = res.type;
          this.questionPaper = res;
          if (!this.breadcrumModified)
            this.breadcrumbNavService.pushOnClickCrumb({ label: res.name });
          this.breadcrumModified = true;
          this.quest = res;
          let stageFound = false;
          this.testStages = this.testStages.map(element => {
              if(stageFound){
                element.status = -1;
              }
             else if((element.name.toUpperCase() ==  res?.status) || (element.name == "Pending Verification" && res?.status == "PENDING_VERIFICATION")){
                  element.status = 0;
                  stageFound = true;
              }else {
                element.status = 1;
              }
              return element;
          });
          this.controlparms = res?.controlParam;
          this.modelsections = res?.sections;

          this.totalTestDuration = res?.totalDurationInMinutes;
          this.status = res?.status;
          var dur = 0;
          this.ListOfQuestions_Added_In_All_Sections = [];
          res.sections?.map((sec) => {
            dur += sec.durationInMinutes;
            if (sec.questions)
              sec.questions.map((que) => {
                this.ListOfQuestions_Added_In_All_Sections.push(que);
              });
          });
          this.totalDurationOfSections = dur;
          if (res?.migration && res?.migration.length > 0) {
            var filteredrecords = res.migration.filter(
              (x) => x.status == res.status
            );
            var remarks = filteredrecords[filteredrecords.length - 1];
            var data = JSON.parse(remarks.remarks);
            this.remarks = data.rejectionReason;
          }
          this.setDataSourceOfPaginator(res?.sections);
          this.prepareExpandedStateArray(false, res?.sections?.length);
        });
    }
  }

  setDataSourceOfPaginator(sections?) {
    sections?.map((sec) => {
      if (sec && this.currentOpenedSection)
        if (sec.id === this.currentOpenedSection.id) {
          this.currentOpenedSection = sec;
        }
    });

    if (this.currentOpenedSection) {
      this.ques = this.currentOpenedSection?.questions;
      this.sectionQuestionList = this.getSortedQuestions(this.ques);
      this.totalNumberOfRecords = this.currentOpenedSection?.questions
        ? this.currentOpenedSection?.questions.length
        : 0;
    }
  }

  prepareExpandedStateArray(state, length?, index?) {
    if (index >= 0) {
      for (var i = 0; i < length; i++) {
        if (index == i)
          this.expandedStateArray[i] = !this.expandedStateArray[i];
        else this.expandedStateArray[i] = false;
      }
      return;
    }
    for (var i = 0; i < length; i++) {
      if (!this.expandedStateArray[i]) this.expandedStateArray[i] = state;
    }
  }

  getSectionId(section?: Section, index?) {
    this.currentOpenedSection = section;
    this.prepareExpandedStateArray(true, this.modelsections?.length, index);
    this.section = section;
    if (section != null) {
      this.ques = section?.questions;
      this.sectionQuestionList = this.getSortedQuestions(this.ques);
      this.totalNumberOfRecords = section?.questions
        ? section?.questions.length
        : 0;
      this.getQuestionPaperbyId();
    }
  }

  removeSection(event,section: Section) {
    event.stopPropagation();
    Swal.fire({
      title: 'Are you sure?',
      text: 'want to delete section.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#277da1',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Close',
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        if (
          this.route.snapshot.paramMap.get('id') != null &&
          section.id != null
        ) {
          this.testConfigService
            .removesection(this.route.snapshot.paramMap.get('id'), section.id)
            .subscribe((res: any) => {
              this.toastrService.success('Section deleted successfully');
              this.totalDurationOfSections = 0;
              this.getQuestionPaperbyId();
            });
        }
      }
    });
  }

  initiateVerification() {
    if (this.route.snapshot.paramMap.get('id') != null) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'want to update status.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#277da1',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Close',
        confirmButtonText: 'Update',
      }).then((result) => {
        if (result.isConfirmed) {
          this.testConfigService
            .initiateVerification(this.route.snapshot.paramMap.get('id'))
            .subscribe(
              (res: any) => {
                this.toastrService.success('Status updated successfully');
                this.getQuestionPaperbyId();
              },
              (err) => {
                console.log(err.error.apierror);
                this.toastrService.error(
                  err.error.apierror.message.split('.')[0]
                );
                this.getQuestionPaperbyId();
              }
            );
        }
      });
    }
  }

  publishstatus() {
    if (this.route.snapshot.paramMap.get('id') != null) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'want to update status.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#277da1',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Close',
        confirmButtonText: 'Update',
      }).then((result) => {
        if (result.isConfirmed) {
          this.testConfigService
            .publish(this.route.snapshot.paramMap.get('id'))
            .subscribe((res: any) => {
              this.toastrService.success('Status updated successfully');
              this.getQuestionPaperbyId();
            });
        }
      });
    }
  }

  archive() {
    if (this.route.snapshot.paramMap.get('id') != null) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'want to update status.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#277da1',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Close',
        confirmButtonText: 'Update',
      }).then((result) => {
        if (result.isConfirmed) {
          this.testConfigService
            .archive(this.route.snapshot.paramMap.get('id'))
            .subscribe((res: any) => {
              this.toastrService.success('Status updated successfully');
              this.getQuestionPaperbyId();
            });
        }
      });
    }
  }

  verifyReject() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'want to update status.',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonColor: '#277da1',
      showCancelButton: true,
      confirmButtonText: `Verify`,
      denyButtonText: `Reject`,
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.route.snapshot.paramMap.get('id') != null) {
          this.testConfigService
            .verify(this.route.snapshot.paramMap.get('id'))
            .subscribe((res: any) => {
              this.toastrService.success('Status updated successfully');
              this.getQuestionPaperbyId();
            });
        }
      } else if (result.isDenied) {
        const dialogRef = this.dialog.open(RejectstatusComponent, {
          maxWidth: '500px',
          width: '100%',
          height: 'auto',
          hasBackdrop: false,
          backdropClass: 'dialog-backdrop',
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result != null) {
            var data = {
              rejectionReason: result.reason,
            };
            this.testConfigService
              .rejectionVerification(
                this.route.snapshot.paramMap.get('id'),
                data
              )
              .subscribe((res: any) => {
                this.toastrService.success('Status updated successfully');
                this.getQuestionPaperbyId();
              });
          }
        });
      }
    });
  }

  restore() {
    if (this.route.snapshot.paramMap.get('id') != null) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'want to restore.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#277da1',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Close',
        confirmButtonText: 'Submit',
      }).then((result) => {
        if (result.isConfirmed) {
          let model = new TestVM();
          model.status = Status.DRAFT;
          model.testId = this.route.snapshot.paramMap.get('id');
          this.testConfigService.updateQuestionPaper(model).subscribe(
            (res: any) => {
              this.toastrService.success('Status updated successfully');
              this.getQuestionPaperbyId();
            },
            (error) => {
              debugger;
              if (error.status == 200) {
                this.toastrService.success('Status updated successfully');
                this.getQuestionPaperbyId();
              } else {
                this.toastrService.error(
                  error?.error?.message
                    ? error?.error?.message
                    : error?.message,
                  'Error'
                );
              }
            }
          );
        }
      });
    }
  }

  applyFilter(e) {

  }

  goBack() {
    this.location.back();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sectionQuestionList, event.previousIndex, event.currentIndex);
    this.sectionQuestionList = this.sectionQuestionList.map((x,index) => {
      x.sequenceNumber = index;
      return x;
    }
     );
  }

  saveQuestionSequence(event,section: Section){
    event.stopPropagation();
    this.testConfigService.updateQuestionSequence( this.testId,section.id,this.sectionQuestionList).subscribe(resp => {
      this.toastrService.success('Sequence is successfully saved');
    },error => {
      this.toastrService.error('Failed to save Sequence');
    })

  }

  getSortedQuestions(questions: any[]) {
    if (questions && questions.length > 0) {
      questions.sort((a, b) => {
        if (a.sequenceNumber == 0 && b.sequenceNumber == 0 ) {
          const passage1 = a.passageContent ? a.passageContent : '';

          const passage2 = b.passageContent ? b.passageContent : '';

          const passageName1 = passage1 + (a.name ? a.name : '');
          const passageName2 = passage2 + (b.name ? b.name : '');
          return (passageName1 < passageName2 ? -1 : (passageName1 > passageName2 ? 1 : 0));
        } else {
          return a.sequenceNumber - b.sequenceNumber;

        }
      });
    }
    return questions;
  }


  allowToExpand(event){
     event.stopPropagation();
  }
}
