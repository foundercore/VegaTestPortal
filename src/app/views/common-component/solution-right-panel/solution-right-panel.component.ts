import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { StudentReportModel } from 'src/app/models/reports/student-report-model';

@Component({
  selector: 'app-solution-right-panel',
  templateUrl: './solution-right-panel.component.html',
  styleUrls: ['./solution-right-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SolutionRightPanelComponent implements OnInit {

  @Input() data  = new EventEmitter <StudentReportModel>();

  public actualData :StudentReportModel;


  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {
      this.data.subscribe(resp => {

         this.actualData = resp

         this.ref.detectChanges();

      });
  }

}
