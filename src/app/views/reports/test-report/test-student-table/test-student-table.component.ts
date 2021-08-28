import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PAGE_OPTIONS } from 'src/app/core/constants';
import { TestAssignmentServiceService } from 'src/app/services/assignment/test-assignment-service.service';

@Component({
  selector: 'app-test-student-table',
  templateUrl: './test-student-table.component.html',
  styleUrls: ['./test-student-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TestStudentTableComponent implements OnInit {

  testId;

  testName;

  showGrid = true;

  dataSource = new MatTableDataSource<any>();

  rankingDisplayedColumn: string[] = [
    'rank',
    'name',
    'marksReceived',
    'totalMarks',
    'percentile',
  ];

  expandedElement:any | null

  public pageOptions = PAGE_OPTIONS;

  sectionLevelSummaryDisplayedColumns: string[] = ['name', 'markRecieved', 'totalMark', 'percentile'];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
     public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private testReportService: TestAssignmentServiceService,
    private router: Router,
    private toastr: ToastrService,
    private ref: ChangeDetectorRef)
    {
    router.events.subscribe((val) => {
      // see also
      if (val instanceof NavigationEnd) {
        if (val.url.includes('assignment_report')) {
          this.showGrid = false;
        } else {
          this.showGrid = true;
        }
        ref.detectChanges();
      }
    });
   }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.getAssignments(params.test_id);
      this.testName = params.test_name;
      this.testId = params.test_id;
    });
  }

  getAssignments(username) {
    this.testReportService
      .getStudentTestReport(username)
      .subscribe((resp) => {

        let sorted = resp.slice().sort(function (a, b) {
          return b.markRecieved - a.markRecieved;
        });
        let tempRank = 0;
        let tempMarkReceived;
        let ranks = sorted.map(function (v, index, userName) {
          if (
            tempMarkReceived == undefined ||
            tempMarkReceived != v.markRecieved
          ) {
            tempRank++;
          }
          tempMarkReceived = v.markRecieved;
          v.rank = tempRank;
          return v;
        });

        this.dataSource = new MatTableDataSource<any>(ranks);
        this.dataSource.paginator = this.paginator;
      });
  }

  getSectionalTotalCount(datasource,param:string){
    let sum = 0;
    datasource.sectionReports.forEach(x => sum+= x[param]);
    return sum;
  }


}
