import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { StudentReportModel } from 'src/app/models/reports/student-report-model';

@Component({
  selector: 'app-solution-right-panel',
  templateUrl: './solution-right-panel.component.html',
  styleUrls: ['./solution-right-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolutionRightPanelComponent implements OnInit {
  @Input() data = new EventEmitter<StudentReportModel>();

  public actualData: StudentReportModel;

  accuracy: number;

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.data.subscribe((resp) => {
      this.actualData = resp;

      if (resp.correct == 0) {
        this.accuracy = 0;
      } else {
        this.accuracy = Math.round((resp.correct / resp.attempt) * 100);
      }

      this.ref.detectChanges();
    });
  }
}
