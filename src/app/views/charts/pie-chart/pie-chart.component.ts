import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {


  @Input()
  title = "Student count by Grade and Gender";

  single: any[] = [
    {
      "name": "Grade 1",
      "value": 442
    },
    {
      "name": "Grade 2",
      "value": 357
    },
    {
      "name": "Grade 3",
      "value": 381
    },
      {
      "name": "Grade 4",
      "value": 452
    },
    {
    "name": "Grade 5",
    "value": 100
  }
  ];;
  view: any[] = [700, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = true;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#FFE600', '#816AF8', '#2D99FE', '#2CD9C5','#FF6C40']
  };

  constructor() {

  }
  ngOnInit(): void {

  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
