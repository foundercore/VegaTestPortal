import { UserService } from 'src/app/services/users/users.service';
import { StudentBatchService } from 'src/app/services/student-batch/student-batch.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AddUserDialogComponent } from '../../user/add-user-dialog/add-user-dialog.component';
import { StudentBatchModel } from 'src/app/models/student-batch/student-batch-model';
import { forkJoin } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { TranslateService } from '@ngx-translate/core';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';

@Component({
  selector: 'app-add-batch-student',
  templateUrl: './add-batch-student.component.html',
  styleUrls: ['./add-batch-student.component.scss'],
})
export class AddBatchStudentComponent implements OnInit {
  previousStudentList = [];

  taggedStudentList = [];

  availableStudentList = [];

  filteredStudentList = [];

  filteredTaggedStudentList = [];

  isUserAdmin = false;

  leftSideSelection = new SelectionModel<string>(true, []);
  rightSideSelection = new SelectionModel<string>(true, []);

  constructor(
    private studentBatchService: StudentBatchService,
    private userService: UserService,
    private tosterService: ToastrService,
    public translate: TranslateService,
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    public authorizationService: AuthorizationService,
    @Inject(MAT_DIALOG_DATA) public data: StudentBatchModel
  ) {}

  ngOnInit() {
    this.isUserAdmin = this.authorizationService.isAdmin;
    this.studentBatchService
      .getStudentBatch(this.data.id.batchId)
      .subscribe((resp) => {
        this.taggedStudentList = resp.students !== null ? resp.students : [];
        this.filteredTaggedStudentList = this.taggedStudentList;
        this.previousStudentList = Array.from(
          resp.students !== null ? resp.students : []
        );
        this.userService.getUserList().subscribe((resp) => {
          this.availableStudentList = resp
            .filter((x) => x.roles.includes('ROLE_STUDENT'))
            .map((x) => x.email)
            .filter((x) => !this.taggedStudentList.includes(x));
            this.filteredStudentList = this.availableStudentList;
        });
      });
  }

  addStudent() {
    if (!this.authorizationService.isAdmin) {
      return;
    }
    const addStudentList = this.taggedStudentList.filter(
      (x) => !this.previousStudentList.includes(x)
    );
    const removeStudentList = this.previousStudentList.filter(
      (x) => !this.taggedStudentList.includes(x)
    );
    let sources = [];
    if (addStudentList.length !== 0) {
      sources.push(
        this.studentBatchService.addStudentInBatch(
          this.data.id.batchId,
          addStudentList
        )
      );
    }
    if (removeStudentList.length !== 0) {
      sources.push(
        this.studentBatchService.removeStudentFromBatch(
          this.data.id.batchId,
          removeStudentList
        )
      );
    }

    forkJoin(...sources).subscribe((results) => {
      this.tosterService.success('Student is tagged successfully');
      this.dialogRef.close();
    });
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
    this.filteredStudentList = this.availableStudentList;
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
    this.filteredStudentList = this.availableStudentList;
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
    this.filteredStudentList = this.searchStudent(event.target.value);
  }

  searchStudent(value: string) {
    let filter = value.toLowerCase();
    return this.availableStudentList.filter((option) =>
    option.toLowerCase().includes(filter)
    );
  }

  searchTagStudent(event) {
    this.filteredTaggedStudentList = this.searchTagged(event.target.value);
  }

  searchTagged(value: string) {
    let filter = value.toLowerCase();
    return this.taggedStudentList.filter((option) =>
    option.toLowerCase().includes(filter)
    );
  }

}
