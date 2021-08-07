import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-live-test-window',
  templateUrl: './live-test-window.component.html',
  styleUrls: ['./live-test-window.component.scss']
})
export class LiveTestWindowComponent implements OnInit {

  isTestStarted = false;

  testData;

  assignmentData;

  isTestLive = false;

  constructor() { }

  ngOnInit() {
  }


  startTest(event){
    this.isTestStarted = event.isTestStarted;
    this.testData = event.testData;
    this.isTestLive = event.isTestLive;
    this.assignmentData = event.assignmentData;
  }

}