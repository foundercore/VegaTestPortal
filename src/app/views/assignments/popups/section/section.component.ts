import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
