import { Component, Input, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-stacked-vertical-bar-chart',
  templateUrl: './stacked-vertical-bar-chart.component.html',
  styleUrls: ['./stacked-vertical-bar-chart.component.scss']
})
export class StackedVerticalBarChartComponent implements OnInit {



  @Input() data;

  title = "Stack Vertical Bar Chart";

  barChartData: any[] = [ ];

  view:[number, number] = [550,500];
  // options
   showLegend: boolean = true;
  showLabels: boolean = true;
   legendPosition:LegendPosition =  LegendPosition.Below ;
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
   showXAxisLabel: boolean = false;
  xAxisLabel: string = 'Country';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Marks';
  animations: boolean = true;

  colorScheme = {
    domain: ['#FFE600', '#816AF8', '#2D99FE', '#2CD9C5','#FF6C40']
  };

  constructor() {

  }
  ngOnInit(): void {
      this.title = this.data.title;
      this.barChartData = this.data.data;
      if(this.data?.config?.colorScheme){
          this.colorScheme = {
            domain : this.data?.config.colorScheme
          }
      }
      if(this.data?.config?.view){
        //this.view = undefined;
      }
  }

  onSelect(data): void {

  }

  onActivate(data): void {

  }

  onDeactivate(data): void {

  }

}
