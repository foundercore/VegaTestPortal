import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
