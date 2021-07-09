import { Component, Input, OnInit } from '@angular/core';
import { Metric } from 'src/app/models/reports/student-report-model';

@Component({
  selector: 'app-student-assignment-stats-charts',
  templateUrl: './student-assignment-stats-charts.component.html',
  styleUrls: ['./student-assignment-stats-charts.component.scss']
})
export class StudentAssignmentStatsChartsComponent implements OnInit {

  @Input() reportData;

  @Input() metric : Metric;

  constructor() {
    console.log(this.reportData);
  }

  ngOnInit() {
      console.log(this.reportData);
  }

}
