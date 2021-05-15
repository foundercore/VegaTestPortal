import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-assessment-editor',
  templateUrl: './assessment-editor.component.html',
  styleUrls: ['./assessment-editor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentEditorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
