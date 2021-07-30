import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { mergeMap, map } from 'rxjs/operators';
import { AppState } from 'src/app/state_management/_states/auth.state';
import { TestConfigService } from '../../assignments/services/test-config-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-live-test-instruction',
  templateUrl: './live-test-instruction.component.html',
  styleUrls: ['./live-test-instruction.component.scss']
})
export class LiveTestInstructionComponent implements OnInit {

  displayName;

  userName;

  totalQuestion = 0;

  totalTestDuration;

  totalSections;

  testName;

  instructions;

  testData;

  sectionList = [
    {
      number:'NUMBER',
      name:'SECTION',
      totalQuestions:'QUESTIONS'
    }
  ];

  @Output() startTestEvent = new EventEmitter<{isTestStarted:boolean,testData: any}>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private testConfigService: TestConfigService,
    private store: Store<AppState>,
    private location: Location
    )
    {

      this.store.select('appState').subscribe((data) => {
        this.displayName = data.user.displayName;
        this.userName = data.user.userName;
      });

      this.activatedRoute.params.pipe( mergeMap(params => this.testConfigService.getQuestionPaper(params.test_id)))
      .subscribe(resp =>{
            this.testData = resp;
            console.log(resp);
            resp.sections.forEach((section,index) => {
              section.number = index + 1;
              this.sectionList.push(section)
              this.totalQuestion += section.totalQuestions;
            });
            this.totalSections = resp.sections.length;
            this.totalTestDuration = resp.totalDurationInMinutes;
            this.testName = resp.name;
            this.instructions = resp.instructions;
          }
      )
  }

  ngOnInit() {
  }


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sectionList, event.previousIndex, event.currentIndex);
  }

  cancel(){
    this.location.back();
  }

  startTest(){
      this.startTestEvent.emit({
       isTestStarted:true,
       testData: this.testData
      });
  }
}
