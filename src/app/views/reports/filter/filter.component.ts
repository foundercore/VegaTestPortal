import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

export class FilterModel {
  questionType: string;
  subject: string;
  topic: string;
  difficulty: string;
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit {
  @Output() filterParameters = new EventEmitter<any>();
  constructor() {}
  ngOnInit(): void {}

  filterGroup = new FormGroup({
    questionTypeCntrl: new FormControl(),
    subjectCntrl: new FormControl(),
    topicCntrl: new FormControl(),
    difficulty: new FormControl(),
  });

  questionTypeList = ['FIB', 'MCQ', 'FRACTIONS', 'PACKAGE'];
  subjectLists = ['MATHS', 'PHYSICS', 'CHEMISTRY'];
  topicLists = ['XYZ', 'UIOP', 'QWERTY'];
  difficultyLevels = ['EASY', 'MEDIUM', 'HARD'];

  applyFilter() {
    const filterValues = new FilterModel();
    filterValues.subject = this.filterGroup.get('subjectCntrl').value;
    filterValues.questionType = this.filterGroup.get('questionTypeCntrl').value;
    filterValues.topic = this.filterGroup.get('topicCntrl').value;
    filterValues.difficulty = this.filterGroup.get('difficulty').value;
    this.filterParameters.emit({ filterData: filterValues });
  }
}
