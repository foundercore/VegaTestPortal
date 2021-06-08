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
  selection = new SelectionModel<any>(true, []);
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
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private testConfigService: TestConfigService,
    private toastrService: ToastrService
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
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
          this.controlparms = res?.controlParam;
          this.modelsections = res?.sections;
          this.totalTestDuration = res?.totalDurationInMinutes;
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

  searchtest() {
    if (
      this.searchText != '' &&
      this.searchText != null &&
      this.searchText != undefined &&
      this.searchText.length > 3
    ) {
      this.ques = this.ques.filter(
        (x) =>
          x.name.toLowerCase().includes(this.searchText) ||
          x.name.toUpperCase().includes(this.searchText)
      );
      this.dataSource = new MatTableDataSource(this.ques);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } else {
      this.dataSource = new MatTableDataSource(this.ques2);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

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
}
