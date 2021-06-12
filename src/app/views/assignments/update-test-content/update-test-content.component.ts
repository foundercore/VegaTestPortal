import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SectionComponent } from '../popups/section/section.component';
import { Section } from '../models/sections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TestconfigComponent } from '../popups/test-config/test-config.component';
import { QuestionslistComponent } from '../popups/questions-list/questions-list.component';
import { ActivatedRoute } from '@angular/router';
import { TestConfigService } from '../services/test-config-service';
import { ToastrService } from 'ngx-toastr';
import { TestConfigurationVM } from '../models/test-configuration';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { SelectionModel } from '@angular/cdk/collections';
import { PAGE_OPTIONS } from 'src/app/core/constants';
import { EditSectionComponent } from '../popups/edit-section/edit-section.component';
import { QuestionModel } from 'src/app/models/questions/question-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-test-content',
  templateUrl: './update-test-content.component.html',
  styleUrls: ['./update-test-content.component.css'],
})
export class UpdateTestContentComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  totalNumberOfRecords = 0;
  public pageOptions = PAGE_OPTIONS;
  panelOpenState: boolean = false;
  modelsections: any = ([] = []);
  section = new Section();
  ques = [];
  testId: string = '';
  controlparms: TestConfigurationVM;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<QuestionModel>(true, []);
  displayedColumns: string[] = [
    'select',
    'name',
    'negative',
    'positive',
    'skip',
  ];
  totalTestDuration: number = 0;
  totalDurationOfSections: number = 0;
  sectionId: string = '';
  searchText: string = '';
  ques2 = [];
  questionPaper = {};
  quest: any;
  status: string = '';
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private testConfigService: TestConfigService,
    private toastrService: ToastrService,
    private router: Router,
  ) {}

  ngOnInit(): void {
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

  editSection(section: Section) {
    const dialogRef = this.dialog.open(EditSectionComponent, {
      maxWidth: '1700px',
      width: 'fit-content',
      minHeight: '15vh',
      height: 'fit-content',
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
        //debugger;
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
            this.toastrService.error('Error while deteing questions=>' + err);
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

  viewAssignment(){
    this.router.navigate([
      'home/tests/update-test/' + this.testId + '/view-assignment',
    ]);
  }


  isAllSelected() {
    if (this.dataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource?.data.length;
      return numSelected === numRows;
    }
    return false;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
    console.log('this.dataSource.data', this.dataSource.data);
  }

  TestConfig() {
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
        selectedques: this.ques,
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
          this.questionPaper = res;
          this.quest = res;
          this.controlparms = res?.controlParam;
          this.modelsections = res?.sections;
          this.totalTestDuration = res?.totalDurationInMinutes;
          this.status = res?.status;
          var dur = 0;
          res.sections.map((sec) => {
            dur += sec.durationInMinutes;
          });
          this.totalDurationOfSections = dur;
          console.log('this.gettest==', res);
        });
    }
  }

  getSectionId(section: Section) {
    this.section = section;
    if (section != null) {
      this.ques = section?.questions;
      this.ques2 = section?.questions;
      this.dataSource = new MatTableDataSource(this.ques);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  // searchtest() {
  //   if (
  //     this.searchText != '' &&
  //     this.searchText != null &&
  //     this.searchText != undefined &&
  //     this.searchText.length > 3
  //   ) {
  //     this.ques = this.ques.filter(
  //       (x) =>
  //         x.name.toLowerCase().includes(this.searchText) ||
  //         x.name.toUpperCase().includes(this.searchText)
  //     );
  //     this.dataSource = new MatTableDataSource(this.ques);
  //     this.dataSource.sort = this.sort;
  //     this.dataSource.paginator = this.paginator;
  //   } else {
  //     this.dataSource = new MatTableDataSource(this.ques2);
  //     this.dataSource.sort = this.sort;
  //     this.dataSource.paginator = this.paginator;
  //   }
  // }

  removeSection(section: Section) {
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


  applyFilter() {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }



}
