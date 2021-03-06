import { Component, Input, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {


  @Input() data;

  title = "Student count by Grade and Gender";

  piedata: any[] = [ ];

  showCountOnly = true;

  view:[number, number] = [550,500];
  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = true;
  legendPosition:LegendPosition =  LegendPosition.Below ;

  colorScheme = {
    domain: ['#FFE600', '#816AF8', '#2D99FE', '#2CD9C5','#FF6C40']
  };

  constructor() {

  }
  ngOnInit(): void {
      this.title = this.data.title;
      this.piedata = this.data.data;
      if(this.data?.config?.colorScheme){
          this.colorScheme = {
            domain : this.data?.config.colorScheme
          }
      }
      if(this.data?.config?.view){
        this.view = undefined;
      }
  }

  labelFormatting(name?) {
    let self: any = this; // this "this" will refer to the chart component (pun intented :))

    let data = self.series.filter(x => x.name == name); // chartData will be present in
                                                        // series along with the label
    return `${data[0].value}`;

  }

  onSelect(data): void {

  }

  onActivate(data): void {

  }

  onDeactivate(data): void {

  }
}
