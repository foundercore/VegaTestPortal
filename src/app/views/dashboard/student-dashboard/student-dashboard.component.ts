import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PAGE_OPTIONS } from 'src/app/core/constants';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentDashboardComponent implements OnInit {

  resultStats =[
    {
      "name": "Passed",
      "value": 60
    },
    {
      "name": "Failed",
      "value": 30
    },
  ];

 resultData: any[] = [
    {name: 'Test 1', totalScore: 100, markObtained: 30,percentage: 30 ,status:'Pass',color:'green'},
    {name: 'Test 2', totalScore: 100, markObtained: 30,percentage: 30 ,status:'Pass',color:'green'},
    {name: 'Test 3', totalScore: 100, markObtained: 30,percentage: 30 ,status:'Pass',color:'green'},
    {name: 'Test 4', totalScore: 100, markObtained: 30,percentage: 30 ,status:'Pass',color:'green'},
    {name: 'Test 5', totalScore: 100, markObtained: 30,percentage: 30 ,status:'Fail',color:'red'},
    {name: 'Test 6', totalScore: 100, markObtained: 30,percentage: 30 ,status:'Fail',color:'red'},
  ];

  single: any[] | undefined;
  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme = {
    domain: [ '#52D726', '#FF0000']
  };

  public pageOptions = PAGE_OPTIONS;

  displayedColumns: string[] = ['name', 'totalScore', 'markObtained','percentage','status','actions'];

  dataSource = new MatTableDataSource<any>(this.resultData);

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor() {

  }


  ngOnInit(): void {
  }

  viewResult(row:any ){

  }
}
