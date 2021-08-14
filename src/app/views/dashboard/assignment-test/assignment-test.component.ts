import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  Input,
  OnChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { PAGE_OPTIONS } from 'src/app/core/constants';
import { AppState } from 'src/app/state_management/_states/auth.state';
import { TestConfigService } from '../../assignments/services/test-config-service';

@Component({
  selector: 'app-assignment-test',
  templateUrl: './assignment-test.component.html',
  styleUrls: ['./assignment-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignmentTestComponent implements OnInit, OnChanges {
  @Input() data;

  resultData: any[] = [];

  searchText: string = '';
  appState: any;
  userName: string = '';
  currentSectionSubmittedData: any;
  studentName: string = '';
  userType: string = '';
  createdId: string = '';

  public pageOptions = PAGE_OPTIONS;

  displayedColumns: string[] = ['testName', 'attempted', 'actions'];

  dataSource = new MatTableDataSource<any>();

  isLoadingResults = false;
  isRateLimitReached = false;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public translate: TranslateService,
    public dialog: MatDialog,
    private store: Store<AppState>,
    private testConfigService: TestConfigService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.store.select('appState').subscribe((data) => {
      this.userName = data?.user?.userName;
      this.studentName = data?.user?.firstName + ' ' + data?.user?.lastName;
      this.userType = data?.user?.authorities[0]?.authority;
      console.log('data', data);
    });
    this.getMyAssignments();
  }

  ngOnChanges() {
    this.getMyAssignments();
  }

  getMyAssignments() {
    this.dataSource.data = this.data;
    this.dataSource.sort = this.sort;
  }

  startTest(element) {
    const timeNow = new Date().setHours(0, 0, 0, 0);
    const testValidFrom = new Date(element.validFrom).setHours(0, 0, 0, 0);
    const testvalidTo = new Date(element.validTo).setHours(0, 0, 0, 0);
    if (timeNow < testValidFrom) {
      this.toastrService.error('Test is yet to start');
      return;
    }
    if (timeNow > testvalidTo) {
      this.toastrService.error('Test has ended already');
      return;
    }
    this.router.navigate([ '/live_test', element.testId,element.assignmentId]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewResult(row: any) {
    console.log('View Result function received parameters=>', row);
    this.testConfigService
      .getStudentAssignmentResult(row.assignmentId, this.userName)
      .subscribe(
        (res) => {
          console.log('Fetched Student assignment result =>', res);
          this.router
            .navigate(['/home/dashboard/assignment_report/' + row.assignmentId])
            .then(() => console.log('Navigate to score card'))
            .catch((err) =>
              console.log('Error=> Navigate to score card=>', err)
            );
        },
        (err) => {
          console.log('Error while Fetching Student assignment result =>', err);
        }
      );
  }

}
