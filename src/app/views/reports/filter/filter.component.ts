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
  questionType: string;
  subject: string;
  topic: string;
  difficulty: string;
  state:string;
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit {

  @Input() questionList;
  @Input() subjectList;
  @Input() topicList;
  @Input() difficulty;
  @Input() state;
  
  @Output() filterParameters = new EventEmitter<any>();
  constructor() {}
  ngOnInit(): void {}

  filterGroup = new FormGroup({
    questionTypeCntrl: new FormControl(),
    subjectCntrl: new FormControl(),
    topicCntrl: new FormControl(),
    difficulty: new FormControl(),
    state : new FormControl()
  });

  questionTypeList = ['FIB', 'MCQ', 'FRACTIONS', 'PACKAGE'];
  subjectLists = ['MATHS', 'PHYSICS', 'CHEMISTRY'];
  topicLists = ['XYZ', 'UIOP', 'QWERTY'];
  difficultyLevels = ['EASY', 'MEDIUM', 'HARD'];
  states = ['CORRECT','INCORRECT'];

  applyFilter() {
    const filterValues = new FilterModel();
    filterValues.subject = this.filterGroup.get('subjectCntrl').value;
    filterValues.questionType = this.filterGroup.get('questionTypeCntrl').value;
    filterValues.topic = this.filterGroup.get('topicCntrl').value;
    filterValues.difficulty = this.filterGroup.get('difficulty').value;
    filterValues.state = this.filterGroup.get('state').value;
    console.log(filterValues);
    this.filterParameters.emit({ filterData: filterValues });
  }

  resetFilter(){
    this.filterGroup.reset();
  }

  toggleSelection(chip: MatChip) {
    chip.toggleSelected();
 }
}
