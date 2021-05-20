import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PAGE_OPTIONS } from 'src/app/core/constants';

@Component({
  selector: 'app-student-report',
  templateUrl: './student-report.component.html',
  styleUrls: ['./student-report.component.scss']
})
export class StudentReportComponent implements OnInit {

  filterList = ["Section Level","Area Level","Topic Level","Difficulty Level","Solution"];


  displayedColumns: string[] = [
    'name',
    'question',
    'timeTaken',
    'attempt',
    'incorrect',
    'skipped',
    'score',
    'accuracy',
    'correct'
  ];


  public pageOptions = PAGE_OPTIONS;

  isLoading: boolean = true;

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor() { }

  ngOnInit() {
    this.isLoading = false;
  }

}
