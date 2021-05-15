import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AssessmentEditorComponent } from '../popups/assessment-editor/assessment-editor.component'; 

@Component({
  selector: 'app-list-tests',
  templateUrl: './list-tests.component.html',
  styleUrls: ['./list-tests.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListTestsComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }


   // add section dialog ts here
   addSection() {
    const dialogRef = this.dialog.open(AssessmentEditorComponent, {
      maxWidth: '500px',
      width: '100%',
      height: 'auto'
    });
  }

  
}
