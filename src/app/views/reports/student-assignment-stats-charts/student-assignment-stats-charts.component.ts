import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-student-assignment-stats-charts',
  templateUrl: './student-assignment-stats-charts.component.html',
  styleUrls: ['./student-assignment-stats-charts.component.scss']
})
export class StudentAssignmentStatsChartsComponent implements OnInit {

  @Input() reportData;

  constructor() {
    console.log(this.reportData);
  }

  ngOnInit() {
      console.log(this.reportData);
  }

}
