import { state } from '@angular/animations';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatChip } from '@angular/material/chips/chip';
import { QuestionConstants } from 'src/app/models/questions/question-model';

export class FilterModel {
  subtopic: string[];
  subject: string[];
  topic: string[];
  difficulty: string[];
  state: string[];
}

@Component({
  selector: 'app-solution-filter',
  templateUrl: './solution-filter.component.html',
  styleUrls: ['./solution-filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolutionFilterComponent implements OnInit {
  subtopicList = [];
  subjectLists = [];
  topicLists = [];
  difficultyLevels = QuestionConstants.DIFFICULTY_LEVEL;
  states = ['CORRECT', 'INCORRECT', 'SKIPPED'];

  filteredTopics = this.topicLists;
  filteredSubjects = this.subjectLists;
  filteredSubtopics = this.subtopicList;

  @Input() data = new EventEmitter();

  @Output() filterParameters = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    this.data.subscribe((resp) => {
      resp.forEach((section) => {
        section.answers.forEach((element) => {
          if (
            element.subTopic?.length != 0 &&
            !this.subtopicList.includes(element.subTopic) && element.subtopic

          ) {
            this.subtopicList.push(element.subtopic);
          }
          if (
            !this.subjectLists.includes(element.subject) &&
            element.subject?.length != 0 && element.subject
          ) {
            this.subjectLists.push(element.subject);
          }
          if (
            !this.subjectLists.includes(element.topic) &&
            element.topic?.length != 0 && element.topic
          ) {
            this.topicLists.push(element.topic);
          }
        });
      });
    });
  }

  filterGroup = new FormGroup({
    subTopicCntrl: new FormControl(),
    subjectCntrl: new FormControl(),
    topicCntrl: new FormControl(),
    difficulty: new FormControl(),
    state: new FormControl(),
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

  resetFilter() {
    this.filterGroup.reset();
    const filterValues = new FilterModel();
    this.filterParameters.emit({ filterData: filterValues });
  }

  toggleSelection(chip: MatChip) {
    chip.toggleSelected();
  }

  onsubKey(event) {
    this.filteredSubjects = this.searchSubject(event.target.value);
  }

  searchSubject(value: string) {
    let filter = value.toLowerCase();
    return this.subjectLists.filter((option) =>
      option.toLowerCase().includes(filter)
    );
  }

  onTopicKey(event) {
    this.filteredTopics = this.searchTopic(event.target.value);
  }

  searchTopic(value: string) {
    let filter = value.toLowerCase();
    return this.topicLists.filter((option) =>
      option.toLowerCase().includes(filter)
    );
  }

  onSubTopicKey(event) {
    this.filteredSubtopics = this.searchSubtopic(event.target.value);
  }

  searchSubtopic(value: string) {
    let filter = value.toLowerCase();
    return this.subtopicList.filter((option) =>
      option.toLowerCase().includes(filter)
    );
  }


}
