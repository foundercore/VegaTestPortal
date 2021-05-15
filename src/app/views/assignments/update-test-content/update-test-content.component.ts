import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { SectionComponent } from '../popups/section/section.component';
import { Section } from '../models/sections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-update-test-content',
  templateUrl: './update-test-content.component.html',
  styleUrls: ['./update-test-content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateTestContentComponent implements OnInit {
  panelOpenState : boolean = false;
  sections =[];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
  selection : any;
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    var data = localStorage.getItem("sections");
    if(data != null && data != undefined){
      this.sections = JSON.parse(data);
      console.log("this.store==",this.sections);
    }
  }



  addSection(){
    const dialogRef = this.dialog.open(SectionComponent, {
      maxWidth: '500px',
      width: '100%',
      height: 'auto',
      hasBackdrop: false,
      backdropClass: 'dialog-backdrop',
     
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != null){
        let model = new Section();
        model.duration = result?.duration;
        model.sectionName =  result?.sectionName;
        this.sections.push(model);
        localStorage.setItem("sections",JSON.stringify(this.sections));
        window.location.reload();
      }
    });
  }

  removeItem(section : Section){

  }



  isAllSelected() {
    const numSelected = this.selection?.selected?.length;
    const numRows = this.dataSource?.data?.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection?.clear() :
        this.dataSource?.data.forEach(row => this.selection?.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection?.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }






}
