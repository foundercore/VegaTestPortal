import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-test-preview',
  templateUrl: './test-preview.component.html',
  styleUrls: ['./test-preview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestPreviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
