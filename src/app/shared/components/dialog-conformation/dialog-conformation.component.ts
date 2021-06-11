import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-conformation',
  templateUrl: './dialog-conformation.component.html',
  styleUrls: ['./dialog-conformation.component.scss']
})
export class DialogConformationComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<DialogConformationComponent>) { }

  ngOnInit() {
  }

  delete(){
    this.dialogRef.close("delete");
  }

}
