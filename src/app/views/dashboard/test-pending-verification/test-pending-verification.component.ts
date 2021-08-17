import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  ViewChild,
  Input,
  OnChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { PAGE_OPTIONS } from 'src/app/core/constants';
import { CustomDialogConfirmationModel } from 'src/app/shared/components/custom-dialog-confirmation/custom-dialog-confirmation-model';
import { CustomDialogConfirmationComponent } from 'src/app/shared/components/custom-dialog-confirmation/custom-dialog-confirmation.component';
import { AppState } from 'src/app/state_management/_states/auth.state';
import { SearchQuestionPaperVM } from '../../assignments/models/searchQuestionPaperVM';
import { TestLiveComponent } from '../../assignments/popups/test-live/test-live.component';
import { TestConfigService } from '../../assignments/services/test-config-service';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';

@Component({
  selector: 'app-test-pending-verification',
  templateUrl: './test-pending-verification.component.html',
  styleUrls: ['./test-pending-verification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestPendingVerificationComponent
  implements OnInit, AfterViewInit, OnChanges
{
  public pageOptions = PAGE_OPTIONS;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input() data;

  totalNumberOfRecords = 0;

  dataSource = new MatTableDataSource<any>();

  alltest = [];

  displayedColumns: string[] = ['name', 'status', 'actions'];

  searchText: string = '';
  appState: any;
  userName: string = '';
  currentSectionSubmittedData: any;
  studentName: string = '';
  userType: string = '';
  buttontext: string = '';
  createdId: string = '';
  searchQuestionPaperModel = new SearchQuestionPaperVM();
  isLoadingResults: boolean;
  isRateLimitReached: boolean;

  constructor(
    public dialog: MatDialog,
    public toastrService: ToastrService,
    private router: Router,
    private store: Store<AppState>,
    public authorizationService: AuthorizationService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.store.select('appState').subscribe((data) => {
      this.userName = data?.user?.userName;
      this.studentName = data?.user?.firstName + ' ' + data?.user?.lastName;
      this.userType = data?.user?.authorities[0]?.authority;
      console.log('data', data);
    });

    this.getAllTests();
  }

  ngOnChanges() {
    this.getAllTests();
  }

  getAllTests() {
    this.dataSource.data = this.data;
    this.dataSource.sort = this.sort;
  }

  startTest(element) {
    this.router.navigate([ '/test_preview', element.questionPaperId]);
    return;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
