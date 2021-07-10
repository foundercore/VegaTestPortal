import { Component, Input, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-vertical-bar-chart',
  templateUrl: './vertical-bar-chart.component.html',
  styleUrls: ['./vertical-bar-chart.component.scss']
})
export class VerticalBarChartComponent implements OnInit {

  @Input() data;

  title = "Examination Results by Branch";

  barChartData: any[] = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    }
  ];

  multi: any[];

  view: number[] = [500, 300];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'X Axis Label';
  showYAxisLabel = true;
  yAxisLabel = 'Y Axis Label';
  legendPosition:LegendPosition =  LegendPosition.Below ;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor() { }

  ngOnInit() {
    this.title = this.data?.title;
    this.barChartData = this.data.data;
    if(this.data?.config?.colorScheme){
        this.colorScheme = {
          domain : this.data?.config.colorScheme
        }
    }
    if(this.data?.config){
      this.yAxisLabel = this.data?.config?.yAxisLabel;
      this.xAxisLabel = this.data?.config?.xAxisLabel;
      this.showXAxisLabel = this.data?.config?.showXAxisLabel;
      this.showYAxisLabel = this.data?.config?.showYAxisLabel;

    }
  }

}
