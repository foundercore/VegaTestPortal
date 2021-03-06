import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, merge, Observable, of as observableOf, Subject } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { finalize } from 'rxjs/operators';
import { PAGE_OPTIONS } from 'src/app/core/constants';
import { CustomDialogConfirmationModel } from 'src/app/shared/components/custom-dialog-confirmation/custom-dialog-confirmation-model';
import { CustomDialogConfirmationComponent } from 'src/app/shared/components/custom-dialog-confirmation/custom-dialog-confirmation.component';
import { AppState } from 'src/app/state_management/_states/auth.state';
import Swal from 'sweetalert2';
import { CloneAssignmentComponent } from '../clone-assignment/clone-assignment.component';
import { TestVM } from '../models/postTestVM';
import { SearchQuestionPaperVM } from '../models/searchQuestionPaperVM';
import { Status } from '../models/statusEnum';
import { AssessmentEditorComponent } from '../popups/assessment-editor/assessment-editor.component';
import { TestLiveComponent } from '../popups/test-live/test-live.component';
import { TestConfigService } from '../services/test-config-service';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css'],
})
export class TestsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  totalNumberOfRecords = 0;
  public pageOptions = PAGE_OPTIONS;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  alltest = [];
  displayedColumns: string[] = [
    'select',
    'testName',
    'status',
    // 'minimumDurationInMinutes',
    'tags',
    'totalDurationInMinutes',
    'actions',
  ];
  searchText: string = '';
  appState: any;
  userName: string = '';
  currentSectionSubmittedData: any;
  studentName: string = '';
  userType: string = '';
  createdId: string = '';
  searchQuestionPaperModel = new SearchQuestionPaperVM();
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  actualTotalNumberOfRecords: 0;
  searchPattern: string = '';
  constructor(
    private testConfigService: TestConfigService,
    public dialog: MatDialog,
    public toastrService: ToastrService,
    private router: Router,
    private store: Store<AppState>
  ) {}
  ngAfterViewInit(): void {
    this.store.select('appState').subscribe((data) => {
      this.userName = data.user.userName;
      this.studentName = data.user.firstName + ' ' + data.user.lastName;
      this.userType = data?.user?.authorities[0]?.authority;
      console.log('data', data);
    });

    // this.dataSource = new MatTableDataSource(this.alltest);
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
    // this.GetAllquestionPapers();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const searchTests = this.createSearchObject();
          return this.testConfigService.getAllQuestionPaper(searchTests);
        }),
        map((data) => {
          console.log('data in map=>', data);
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.actualTotalNumberOfRecords = data.totalRecords;
          return data.tests.map((x) => {
            x.explanation_added =
              x.explanation && x.explanation.length ? 'Yes' : 'No';
            return x;
          });
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      )
      .subscribe((data) => {
        this.dataSource.data = data;
        console.log('This.datasource=', this.dataSource);
      });
  }

  ngOnInit(): void {
    // this.alltest.push({"testId" : "fc94065f-b544-4fa0-adfa-dd159da4fd87","testName" : "hello Test","minimumDurationInMinutes" : 45, "totalDurationInMinutes": 50});
  }
  createSearchObject() {
    const searchQuestionPaper = new SearchQuestionPaperVM(
      String(this.paginator.pageIndex + 1),
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction
    );
    searchQuestionPaper.nameRegexPattern = this.searchPattern;
    this.totalNumberOfRecords = this.paginator.pageSize;
    return searchQuestionPaper;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    // console.log("this.selection.selected==",this.selection.selected);
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
    console.log('this.dataSource.data', this.dataSource.data);
  }

  createTest() {
    const dialogRef = this.dialog.open(AssessmentEditorComponent, {
      maxWidth: '900px',
      width: '100%',
      height: 'auto',
      hasBackdrop: false,
      backdropClass: 'dialog-backdrop',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        let model = new TestVM();
        model.totalDurationInMinutes = +result?.duration;
        model.minimumDurationInMinutes = +result?.duration;
        model.name = result?.testName;
        model.instructions = result?.description;
        model.status = Status.DRAFT;
        this.testConfigService.createQuestionPaper(model).subscribe(
          (res: any) => {
            //if (res.isSuccess) {
            this.toastrService.success('Test created successfully');
            this.GetAllquestionPapers();
            console.log('this.createdtest==', res);
            // }
          },
          (error) => {
            if (error.status == 200) {
              this.createdId = error.error.text;
              this.router.navigate([
                '/home/tests/update-test/' + this.createdId,
              ]);
              this.toastrService.success('Test created successfully');
              this.GetAllquestionPapers();
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

  getQuestionPaperbyId(testId: string = '') {
    this.testConfigService
      .getQuestionPaper(testId)
      .pipe(finalize(() => {}))
      .subscribe(
        (res: any) => {
          //  if (res.isSuccess) {
          console.log('this.gettest==', res);
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

  deleteQuestionPaperbyId(testId: string = '') {
    if (testId != null && testId != '') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'want to delete test.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#277da1',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Close',
        confirmButtonText: 'Delete',
      }).then((result) => {
        if (result.isConfirmed) {
          this.testConfigService
            .deleteQuestionPaper(testId)
            .pipe(finalize(() => {}))
            .subscribe(
              (res: any) => {
                this.toastrService.success('Test deleted successfully');
                this.GetAllquestionPapers();
                console.log('this.deltest==', res);
                //}
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
      });
    }
  }

  async deleteSelectedTestsId() {
    if (this.selection.selected.length > 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'want to delete selected tests.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#277da1',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Close',
        confirmButtonText: 'Delete',
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.selection.selected.length > 0) {
            this.selection.selected.forEach(async (element) => {
              if (
                element.questionPaperId != null &&
                element.questionPaperId != ''
              ) {
                await this.testConfigService
                  .deleteQuestionPaper(element.questionPaperId)
                  .pipe(finalize(() => {}))
                  .subscribe(
                    (res: any) => {
                      //this.toastrService.success("Test deleted successfully");
                      this.GetAllquestionPapers();
                      console.log('this.deltest==', res);
                      //}
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
            });
          }
        }
      });
    } else {
      this.toastrService.error('Please select atleast 1 record for delete');
    }
  }

  GetAllquestionPapers() {
    const searchTests = this.createSearchObject();
    this.testConfigService
      .getAllQuestionPaper(searchTests)
      .pipe(finalize(() => {}))
      .subscribe(
        (res: any) => {
          // if (res?.tests?.length > 0) {
            this.alltest = res?.tests;
            this.dataSource.data = this.alltest;
            this.actualTotalNumberOfRecords = res?.totalRecords;
            console.log('this.list test ==', res);
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

  // private getSearchTestModel() {
  //   this.searchQuestionPaperModel.pageNumber = this.paginator.pageIndex + 1;
  //   this.searchQuestionPaperModel.pageSize = this.paginator.pageSize;
  //   this.searchQuestionPaperModel.sortColumn = this.sort.active
  //     ? this.sort.active
  //     : 'lastUpdatedOn';
  //   this.searchQuestionPaperModel.sortOrder = this.sort.direction
  //     ? this.sort.direction
  //     : 'desc';
  //   this.totalNumberOfRecords = this.paginator.pageSize;
  // }

  resetPaging(): void {
    this.paginator.pageIndex = 0;
  }

  getPaginatorData(event: PageEvent): PageEvent {
    this.GetAllquestionPapers();
    return event;
  }

  extractContent(s) {
    var span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  }

  startTest(element) {

    let buttonText = '';
    if (this.userType === 'ROLE_USER_ADMIN' || this.userType === 'ROLE_STAFF') {
      buttonText = 'Preview Test';
    } else {
      buttonText = 'Start Test';
    }

    const dialogData = new CustomDialogConfirmationModel("Want to start test?", element.instructions, buttonText);

    const dialogRef = this.dialog.open(CustomDialogConfirmationComponent, {
      width: "600px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult){
          const dialogRef = this.dialog.open(TestLiveComponent, {
            maxWidth: '1700px',
            width: '100%',
            minHeight: '100vh',
            height: 'auto',
            hasBackdrop: false,
            backdropClass: 'dialog-backdrop',
            data: { testData: element, userType: this.userType,  testType: 'preview'},
          });
          dialogRef.afterClosed().subscribe((result) => {
            this.GetAllquestionPapers();
          });
      }
    });
  }

  applyFilter(e: Event) {
    let namePattern = (e.target as HTMLInputElement)
      .value
      .trim()
      .toLowerCase();
    this.searchPattern = namePattern.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    this.resetPaging();
    this.GetAllquestionPapers();
  }

  cloneTest(assignment: any) {
    const dialogRef = this.dialog.open(CloneAssignmentComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      debugger;
      if (result != null && result?.testName && result?.testName !== '') {
        this.testConfigService
          .getQuestionPaper(assignment?.questionPaperId)
          .pipe(finalize(() => {}))
          .subscribe(
            (res: any) => {
              if (res) {
                res.name = result?.testName;
                this.testConfigService.createQuestionPaper(res).subscribe(
                  (res: any) => {
                    //if (res.isSuccess) {
                    this.toastrService.success('Test cloned successfully');
                    this.GetAllquestionPapers();
                    // }
                  },
                  (error) => {
                    if (error.status == 200) {
                      this.createdId = error.error.text;
                      this.router.navigate([
                        '/home/tests/update-test/' + this.createdId,
                      ]);
                      this.toastrService.success('Test cloned successfully ');
                      this.GetAllquestionPapers();
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
            },
            (error) => {
              this.toastrService.error(
                error?.error?.message ? error?.error?.message : error?.message,
                'Error'
              );
            }
          );
      }
    });
  }
}
