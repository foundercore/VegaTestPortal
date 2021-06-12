import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { PAGE_OPTIONS } from 'src/app/core/constants';
import { TestAssignmentServiceService } from 'src/app/services/assignment/test-assignment-service.service';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentDashboardComponent implements OnInit {

  resultStats =[
    {
      "name": "Passed",
      "value": 60
    },
    {
      "name": "Failed",
      "value": 30
    },
  ];

 resultData: any[] = [  ];

  single: any[] | undefined;
  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme = {
    domain: [ '#52D726', '#FF0000']
  };

  public pageOptions = PAGE_OPTIONS;

  displayedColumns: string[] = ['testName', 'attempted',  'actions'];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    public translate: TranslateService,
    private testAssignmentService: TestAssignmentServiceService,
    ) {

  }


  ngOnInit(): void {
    this.testAssignmentService.getMyAssignment().subscribe(resp => {
      this.resultData = resp
      this.dataSource = new MatTableDataSource<any>(this.resultData);
      this.dataSource.paginator = this.paginator;

    });
  }

  viewResult(row:any ){

  }

  takeTest(row:any ){

  }
}
