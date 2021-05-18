import { UserService } from 'src/app/services/users/users.service';
import { StudentBatchService } from 'src/app/services/student-batch/student-batch.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AddUserDialogComponent } from '../../user/add-user-dialog/add-user-dialog.component';
import { StudentBatchModel } from 'src/app/models/student-batch/student-batch-model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-batch-student',
  templateUrl: './add-batch-student.component.html',
  styleUrls: ['./add-batch-student.component.scss']
})
export class AddBatchStudentComponent implements OnInit {

  previousStudentList = [];

  taggedStudentList = [
  ];

  availableStudentList = [
  ];

  constructor(
    private studentBatchService: StudentBatchService,
    private userService : UserService,
    private tosterService: ToastrService,
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StudentBatchModel
  ) { }

  ngOnInit() {
    this.studentBatchService.getStudentBatch(this.data.id.batchId).subscribe(resp => {
      this.taggedStudentList = resp.students;
      this.previousStudentList = Array.from(resp.students);
      this.userService.getUserList().subscribe(resp => {
        this.availableStudentList = resp.filter(x => x.roles.includes("ROLE_STUDENT")).map(x => x.email).filter(x => !this.taggedStudentList.includes(x));
      });
    })
  }

  addStudent(){

    const addStudentList = this.taggedStudentList.filter(x => !this.previousStudentList.includes(x));
    const removeStudentList = this.previousStudentList.filter(x => !this.taggedStudentList.includes(x));
    let sources = [];
    if (addStudentList.length !== 0) {
      sources.push(this.studentBatchService.addStudentInBatch(this.data.id.batchId,addStudentList));
    }
    if (removeStudentList.length !== 0) {
      sources.push(this.studentBatchService.removeStudentFromBatch(this.data.id.batchId,removeStudentList));
    }


    forkJoin(...sources).subscribe(results => {
      this.tosterService.success('Student is tagged successfully');
      this.dialogRef.close();
    })

  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

}
