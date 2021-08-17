import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-conformation',
  templateUrl: './dialog-conformation.component.html',
  styleUrls: ['./dialog-conformation.component.scss']
})
export class DialogConformationComponent implements OnInit {

  primaryBtnText = "Close";
  secondaryBtnText = "Delete";

  constructor(
    public dialogRef: MatDialogRef<DialogConformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    if(this.data){
      this.primaryBtnText = this.data?.primaryBtnText;
      this.secondaryBtnText = this.data?.secondaryBtnText;
    }
  }

  delete(){
    this.dialogRef.close("delete");
  }


  close(){
    this.dialogRef.close("close");
  }

}
