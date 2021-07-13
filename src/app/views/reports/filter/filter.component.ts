import { state } from '@angular/animations';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatChip } from '@angular/material/chips/chip';

export class FilterModel {
  subtopic: string[];
  subject: string[];
  topic: string[];
  difficulty: string[];
  state: string[];
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit {


  subtopicList = [ ];
  subjectLists = [ ];
  topicLists = [ ];
  difficultyLevels = ['EASY', 'MEDIUM', 'HARD'];
  states = ['CORRECT','INCORRECT','SKIPPED'];


  @Input() data = new EventEmitter();

  @Output() filterParameters = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    this.data.subscribe(resp =>{

      resp.forEach(section => {
        section.answers.forEach(element => {
            if(!this.subtopicList.includes(element.subTopic) && element.subTopic.length != 0){
              this.subtopicList.push(element.subtopic);
            }
            if(!this.subjectLists.includes(element.subject) && element.subject.length != 0){
              this.subjectLists.push(element.subject);
            }
            if(!this.subjectLists.includes(element.topic) && element.topic.length != 0){
              this.topicLists.push(element.topic);
            }

        });
      });


    })
  }

  filterGroup = new FormGroup({
    subTopicCntrl: new FormControl(),
    subjectCntrl: new FormControl(),
    topicCntrl: new FormControl(),
    difficulty: new FormControl(),
    state : new FormControl()
  });

  applyFilter() {
    const filterValues = new FilterModel();
    filterValues.subject = this.filterGroup.get('subjectCntrl').value;
    filterValues.subtopic = this.filterGroup.get('subTopicCntrl').value;
    filterValues.topic = this.filterGroup.get('topicCntrl').value;
    filterValues.difficulty = this.filterGroup.get('difficulty').value;
    filterValues.state = this.filterGroup.get('state').value;
    console.log(filterValues);
    this.filterParameters.emit({ filterData: filterValues });
  }

  resetFilter(){
    this.filterGroup.reset();
    const filterValues = new FilterModel();
    this.filterParameters.emit({ filterData: filterValues });

  }

  toggleSelection(chip: MatChip) {
    chip.toggleSelected();
 }
}
