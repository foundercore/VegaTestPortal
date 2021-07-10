import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-vertical-bar-chart',
  templateUrl: './group-vertical-bar-chart.component.html',
  styleUrls: ['./group-vertical-bar-chart.component.scss']
})
export class GroupVerticalBarChartComponent  {


  @Input()
  title = "Examination Results by Branch";

  multi: any[] = [
    {
      "name": "Arts",
      "series": [
        {
          "name": "Pass",
          "value": -1200
        },
        {
          "name": "Fail",
          "value": 600
        },
        {
          "name": "Not Attended",
          "value": 200
        }
      ]
    },

    {
      "name": "English",
      "series": [
        {
          "name": "Pass",
          "value": 1400
        },
        {
          "name": "Fail",
          "value": 380
        },
        {
          "name": "Not Attended",
          "value": 220
        }
      ]
    },

    {
      "name": "Maths",
      "series": [
        {
          "name": "Pass",
          "value": 1400
        },
        {
          "name": "Fail",
          "value": 350
        },
        {
          "name": "Not Attended",
          "value": 180
        }
      ]
    },

    {
      "name": "Phys. Ed",
      "series": [
        {
          "name": "Pass",
          "value": 1300
        },
        {
          "name": "Fail",
          "value": 450
        },
        {
          "name": "Not Attended",
          "value": 300
        }
      ]
    },

    {
      "name": "Science",
      "series": [
        {
          "name": "Pass",
          "value": 1150
        },
        {
          "name": "Fail",
          "value": 700
        },
        {
          "name": "Not Attended",
          "value": 400
        }
      ]
    }
  ];
  ;
  view: any[] = [700, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = '';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = '';
  legendTitle: string = 'Years';
  legendPosition: string[] = ['below'];

  colorScheme = {
    domain: ['#816AF8', '#2D99FE', '#2CD9C5','#FF6C40','#FFE600']
  };

  constructor() {
  }

}
