import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
