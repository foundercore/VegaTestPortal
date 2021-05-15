import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-setup-test-configuration',
  templateUrl: './setup-test-configuration.component.html',
  styleUrls: ['./setup-test-configuration.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetupTestConfigurationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
