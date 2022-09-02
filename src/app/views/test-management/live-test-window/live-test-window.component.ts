import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-live-test-window',
  templateUrl: './live-test-window.component.html',
  styleUrls: ['./live-test-window.component.scss']
})
export class LiveTestWindowComponent implements OnInit {

  isTestStarted = false;

  testData;

  testType;

  assignmentData;

  isTestLive = false;

  sectionList = [];

  constructor() { }

  ngOnInit() {
  }


  startTest(event){
    this.isTestStarted = event.isTestStarted;
    this.testData = event.testData;
    this.testType = event.testData.type
    if(event.testData.type == "Full Length"){
      this.testData.isSectionTimerTest = true;
    } else {
      this.testData.isSectionTimerTest = false;
    }
    this.isTestLive = event.isTestLive;
    this.assignmentData = event.assignmentData;
    this.sectionList = event.sectionList;
    if(this.testType == 'NMAT'){
      this.testData.sections = this.sectionList;
    }
  }

}
