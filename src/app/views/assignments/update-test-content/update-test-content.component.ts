import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SectionComponent } from '../popups/section/section.component';

@Component({
  selector: 'app-update-test-content',
  templateUrl: './update-test-content.component.html',
  styleUrls: ['./update-test-content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateTestContentComponent implements OnInit {
  panelOpenState : boolean = false;
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  // add section dialog ts here
  addSection() {
    const dialogRef = this.dialog.open(SectionComponent, {
      maxWidth: '500px',
      width: '100%',
      height: 'auto'
    });
  }

}
