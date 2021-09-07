import { SelectionModel } from '@angular/cdk/collections';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AssignmentRequest } from 'src/app/models/test-assignment/test-assignment-request';
import { TestAssignmentServiceService } from 'src/app/services/assignment/test-assignment-service.service';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { StudentBatchService } from 'src/app/services/student-batch/student-batch.service';
import { UserService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-add-students',
  templateUrl: './add-students.component.html',
  styleUrls: ['./add-students.component.scss'],
})
export class AddStudentsComponent implements OnInit {
  previousStudentList = [];

  taggedStudentList = [];

  availableStudentList = [];

  filteredAvailableStudentList = [];

  filteredTaggedStudentList = [];

  isUserAdmin = false;

  locale = 'en-US';

  leftSideSelection = new SelectionModel<string>(true, []);
  rightSideSelection = new SelectionModel<string>(true, []);

  constructor(
    private studentBatchService: StudentBatchService,
    private userService: UserService,
    private tosterService: ToastrService,
    public translate: TranslateService,
    public dialogRef: MatDialogRef<AddStudentsComponent>,
    public authorizationService: AuthorizationService,
    private testAssignmentService: TestAssignmentServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    let assignedStudent =
      this.data.data.assignedToStudent == null
        ? []
        : this.data.data.assignedToStudent;

    this.userService.getUserList().subscribe((resp) => {
      this.availableStudentList = resp.filter(
        (x) => !assignedStudent.includes(x.userName)
      );
      this.filteredAvailableStudentList = this.availableStudentList;

      this.taggedStudentList = resp.filter((x) =>
        assignedStudent.includes(x.userName)
      );
      this.filteredTaggedStudentList = this.taggedStudentList;
    });
  }

  addStudent() {
    if (this.taggedStudentList.length == 0) {
      this.tosterService.error('Atleast one student should be tagged');
      return;
    }

    const assignmentObj: AssignmentRequest = {
      description: this.data.data.description,
      passcode: this.data.data.passcode?.value,
      releaseDate: formatDate(
        this.data.data.releaseDate,
        'yyyy-MM-dd hh:mm:ss',
        this.locale
      ),
      testId: this.data.testId,
      validFrom: formatDate(
        this.data.data.validFrom,
        'yyyy-MM-dd hh:mm:ss',
        this.locale
      ),
      validTo: formatDate(
        this.data.data.validTo,
        'yyyy-MM-dd hh:mm:ss',
        this.locale
      ),
      assignedToBatch: this.data.data.assignedToBatch,
      assignedToStudent: this.taggedStudentList.map((x) => x.userName),
    };
    this.testAssignmentService
      .updateAssignment(this.data.data.assignmentId, assignmentObj)
      .subscribe(
        (resp) => {
          this.tosterService.success('Student is tagged successfully');
          this.dialogRef.close();
        },
        (error) => {
          this.tosterService.error(error.error.apierror.message);
        }
      );
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      this.leftSideSelection.clear();
      this.rightSideSelection.clear();
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  moveItemRightSide() {
    this.leftSideSelection.selected.forEach((x) =>
      this.taggedStudentList.push(x)
    );
    this.availableStudentList = this.availableStudentList.filter(
      (x) => !this.leftSideSelection.selected.includes(x)
    );
    this.filteredTaggedStudentList = this.taggedStudentList;
    this.filteredAvailableStudentList = this.availableStudentList;
    this.leftSideSelection.clear();
  }

  moveItemLeftSide() {
    this.rightSideSelection.selected.forEach((x) =>
      this.availableStudentList.push(x)
    );
    this.taggedStudentList = this.taggedStudentList.filter(
      (x) => !this.rightSideSelection.selected.includes(x)
    );
    this.filteredTaggedStudentList = this.taggedStudentList;
    this.filteredAvailableStudentList = this.availableStudentList;
    this.rightSideSelection.clear();
  }

  //Left side selection
  /** Whether the number of selected elements matches the total number of rows. */
  isAllLeftSelected() {
    const numSelected = this.leftSideSelection.selected.length;
    const numRows = this.availableStudentList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterLeftSelectionToggle() {
    this.isAllLeftSelected()
      ? this.leftSideSelection.clear()
      : this.availableStudentList.forEach((row) =>
          this.leftSideSelection.select(row)
        );
  }

  /** The label for the checkbox on the passed row */
  leftCheckboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllLeftSelected() ? 'select' : 'deselect'} all`;
    }
    return `${
      this.leftSideSelection.isSelected(row) ? 'deselect' : 'select'
    } row ${row.position + 1}`;
  }

  //right side selection
  /** Whether the number of selected elements matches the total number of rows. */
  isAllRightSelected() {
    const numSelected = this.rightSideSelection.selected.length;
    const numRows = this.taggedStudentList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterRightSelectionToggle() {
    this.isAllRightSelected()
      ? this.rightSideSelection.clear()
      : this.taggedStudentList.forEach((row) =>
          this.rightSideSelection.select(row)
        );
  }

  /** The label for the checkbox on the passed row */
  rightCheckboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllRightSelected() ? 'select' : 'deselect'} all`;
    }
    return `${
      this.rightSideSelection.isSelected(row) ? 'deselect' : 'select'
    } row ${row.position + 1}`;
  }

  search(event) {
    this.filteredAvailableStudentList = this.searchStudent(event.target.value);
  }

  searchStudent(value: string) {
    let filter = value.toLowerCase();
    return this.availableStudentList.filter((option) =>
      option.displayName.toLocaleLowerCase().includes(filter)
    );
  }

  searchTagStudent(event) {
    this.filteredTaggedStudentList = this.searchTagged(event.target.value);
  }

  searchTagged(value: string) {
    let filter = value.toLowerCase();
    return this.taggedStudentList.filter((option) =>
      option.displayName.toLocaleLowerCase().includes(filter)
    );
  }
}
