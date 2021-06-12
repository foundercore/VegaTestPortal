import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { PAGE_OPTIONS } from 'src/app/core/constants';
import { AppState } from 'src/app/state_management/_states/auth.state';
import Swal from 'sweetalert2';
import { CloneAssignmentComponent } from '../clone-assignment/clone-assignment.component';
import { TestVM } from '../models/postTestVM';
import { SearchQuestionPaperVM } from '../models/searchQuestionVM';
import { AssessmentEditorComponent } from '../popups/assessment-editor/assessment-editor.component';
import { TestLiveComponent } from '../popups/test-live/test-live.component';
import { TestConfigService } from '../services/test-config-service';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css'],
})
export class TestsComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  totalNumberOfRecords = 0;
  public pageOptions = PAGE_OPTIONS;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  alltest = [];
  alltest2 = [];
  displayedColumns: string[] = [
    'select',
    'testName',
    'minimumDurationInMinutes',
    'totalDurationInMinutes',
    'actions',
  ];
  searchText: string = '';
  appState: any;
  userName: string = '';
  currentSectionSubmittedData: any;
  studentName: string = '';
  userType: string = '';
  buttontext: string = '';
  createdId : string = "";
  constructor(
    private testConfigService: TestConfigService,
    public dialog: MatDialog,
    public toastrService: ToastrService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.store.select('appState').subscribe((data) => {
      this.userName = data.user.userName;
      this.studentName = data.user.firstName + ' ' + data.user.lastName;
      this.userType = data?.user?.authorities[0]?.authority;
      console.log('data', data);
    });
    this.GetAllquestionPapers();
    // this.alltest.push({"testId" : "fc94065f-b544-4fa0-adfa-dd159da4fd87","testName" : "hello Test","minimumDurationInMinutes" : 45, "totalDurationInMinutes": 50});
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
        model.status = "DRAFT";
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
              this.router.navigate(['/home/tests/update-test/' + this.createdId]);
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
    let model = new SearchQuestionPaperVM();
    this.testConfigService
      .getAllQuestionPaper(model)
      .pipe(finalize(() => {}))
      .subscribe(
        (res: any) => {
          //if (res.isSuccess) {
          if (res?.tests?.length > 0) {
            this.alltest = res?.tests;
            this.alltest2 = res?.tests;
            this.dataSource = new MatTableDataSource(this.alltest);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            console.log('this.listtest==', res);
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

  // searchtest() {
  //   if (
  //     this.searchText != '' &&
  //     this.searchText != null &&
  //     this.searchText != undefined &&
  //     this.searchText.length > 3
  //   ) {
  //     this.alltest = this.alltest.filter(
  //       (x) =>
  //         x.name.toLowerCase().includes(this.searchText) ||
  //         x.name.toUpperCase().includes(this.searchText)
  //     );
  //     this.dataSource = new MatTableDataSource(this.alltest);
  //     this.dataSource.sort = this.sort;
  //     this.dataSource.paginator = this.paginator;
  //   } else {
  //     this.alltest = this.alltest2;
  //     this.dataSource = new MatTableDataSource(this.alltest);
  //     this.dataSource.sort = this.sort;
  //     this.dataSource.paginator = this.paginator;
  //   }
  // }

  extractContent(s) {
    var span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  }

  startTest(element) {
    if (this.userType === 'ROLE_USER_ADMIN') {
      this.buttontext = 'Preview Test';
    } else {
      this.buttontext = 'Start Test';
    }
    Swal.fire({
      title: 'Want to start test?',
      text: this.extractContent(element.instructions),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#277da1',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Close',
      confirmButtonText: this.buttontext,
    }).then((result) => {
      if (result.isConfirmed) {
        const dialogRef = this.dialog.open(TestLiveComponent, {
          maxWidth: '1700px',
          width: '100%',
          minHeight: '100vh',
          height: 'auto',
          hasBackdrop: false,
          backdropClass: 'dialog-backdrop',
          data: { testData: element, userType: this.userType },
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.GetAllquestionPapers();
        });
      }
    });

    // this.testConfigService
    //   .getSudentSubmissionState(
    //     element.questionPaperId,
    //     this.userName
    //   )
    //   .subscribe(
    //     (res: any) => {
    //       if(res.submitted){
    //         this.router.navigate(['/home/tests/show-result/' +  element.questionPaperId]);
    //       }
    //       else{
    //         Swal.fire({
    //           title: 'Want to start test?',
    //           text: element.instructions,
    //           icon: 'warning',
    //           showCancelButton: true,
    //           confirmButtonColor: '#277da1',
    //           cancelButtonColor: '#d33',
    //           cancelButtonText: 'Close',
    //           confirmButtonText: 'Start Test'
    //         }).then((result) => {
    //           if (result.isConfirmed) {
    //             const dialogRef = this.dialog.open(TestLiveComponent, {
    //               maxWidth: '1700px',
    //               width: '100%',
    //               minHeight: '100vh',
    //               height: 'auto',
    //               hasBackdrop: false,
    //               backdropClass: 'dialog-backdrop',
    //               data : {testData : element}
    //             });
    //             dialogRef.afterClosed().subscribe(result => {
    //               this.GetAllquestionPapers();
    //             });
    //           }
    //         })
    //       }
    //     },
    //     (error) => {
    //       this.toastrService.error(
    //         error?.error?.message ? error?.error?.message : error?.message,
    //         'Error'
    //       );
    //     }
    //   );
  }

  applyFilter() {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  cloneTest(assignment: any) {
    const dialogRef = this.dialog.open(CloneAssignmentComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe((result) => {
      debugger;
      if (result != null && result?.testName && result?.testName !== '') {
        this.testConfigService
          .getQuestionPaper(assignment?.questionPaperId)
          .pipe(finalize(() => { }))
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
                       this.router.navigate(['/home/tests/update-test/' + this.createdId]);
                       this.toastrService.success('Test cloned successfully ');
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
