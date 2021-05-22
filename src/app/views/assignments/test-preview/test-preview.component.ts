import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CalculatorComponent } from '../popups/calculator/calculator.component';

@Component({
  selector: 'app-test-preview',
  templateUrl: './test-preview.component.html',
  styleUrls: ['./test-preview.component.css']
  
})
export class TestPreviewComponent implements OnInit {
  timeSeconds : number = 30;
  testname : string ="";
  constructor(public dialog : MatDialog ,  private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.testname = this.route.snapshot.paramMap.get('id');
  }

calculate(){
  const dialogRef = this.dialog.open(CalculatorComponent, {
    maxWidth: '500px',
    width: '100%',
    height: 'auto'
  });
}



}
