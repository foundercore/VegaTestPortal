import { Component, OnInit, ChangeDetectionStrategy, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/views/questions/video-preview/video-preview.component';

@Component({
  selector: 'app-test-analysis-institutelist-dialog',
  templateUrl: './test-analysis-institutelist-dialog.component.html',
  styleUrls: ['./test-analysis-institutelist-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestAnalysisInstitutelistDialogComponent implements OnInit {

  displayedColumns: string[] = ['section', 'recievedMarks', 'percentile'];
  dataSource = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    console.log(this.data);
    this.dataSource = this.data.institute.sectionLevelPercentile;
    this.changeDetectorRef.detectChanges()
  }

}
