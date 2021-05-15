import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalculatorComponent } from '../popups/calculator/calculator.component';

@Component({
  selector: 'app-test-preview',
  templateUrl: './test-preview.component.html',
  styleUrls: ['./test-preview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestPreviewComponent implements OnInit {
  timeSeconds : number = 30;
  constructor(public dialog : MatDialog) { }

  ngOnInit(): void {
  }

calculate(){
  const dialogRef = this.dialog.open(CalculatorComponent, {
    maxWidth: '500px',
    width: '100%',
    height: 'auto'
  });
}



}
