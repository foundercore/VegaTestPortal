import { UserService } from 'src/app/services/users/users.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-student-batch-dialog',
  templateUrl: './view-student-batch-dialog.component.html',
  styleUrls: ['./view-student-batch-dialog.component.scss']
})
export class ViewStudentBatchDialogComponent implements OnInit {

  batchList = [];

  constructor(
    public dialogRef: MatDialogRef<ViewStudentBatchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService:UserService) { }

  ngOnInit() {
    this.userService.getLinkedBatch(this.data.email).subscribe(resp => this.batchList = resp)
  }

}
