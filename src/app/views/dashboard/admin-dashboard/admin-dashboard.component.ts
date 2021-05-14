import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent implements OnInit {

  public chartType: string = 'doughnut';
  public barChartType: string = 'bar';
  
  public chartDatasets: Array<any> = [
    { data: [300, 50, 100, 40, 120], label: 'My First dataset' }
  ];

  public chartSingle_blueDatasets: Array<any> = [
    { data: [200, 157], label: 'My Third dataset' }
  ];

  public chartSingle_yellowDatasets: Array<any> = [
    { data: [100, 81, 59, 65], label: 'My Forth dataset' }
  ];

  public chartSingle_GreyDatasets: Array<any> = [
    { data: [400, 40, 56], label: 'My Fifth dataset' }
  ];
  public barChartDatasets: Array<any> = [
    { data: [65, 59, 157, 81, 56, 55, 40], label: 'My First dataset' },
    { data: [11, 12, 157, 13, 14, 15, 16], label: 'My Second dataset' },
  ];

  public chartLabels: Array<any> = ['Red', 'Green', 'Yellow', 'Grey', 'Dark Grey'];
  public barChartLabels: Array<any> = ['Black', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];

  public chartColors: Array<any> = [
    {
      backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
      hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#616774'],
      borderWidth: 1,
    }
  ];

  public chartSingleColors: Array<any> = [
    {
      backgroundColor: ['#F7464A'],
      hoverBackgroundColor: ['#FF5A5E'],
      borderWidth: 1,
    }
  ];

  public chartSingle_blueColors: Array<any> = [
    {
      backgroundColor: ['#46BFBD'],
      hoverBackgroundColor: ['#5AD3D1'],
      borderWidth: 1,
    }
  ];

  public chartSingle_yellowColors: Array<any> = [
    {
      backgroundColor: ['#FDB45C'],
      hoverBackgroundColor: ['#FFC870'],
      borderWidth: 1,
    }
  ];

  public chartSingle_GreyColors: Array<any> = [
    {
      backgroundColor: ['#4D5360'],
      hoverBackgroundColor: ['#616774'],
      borderWidth: 1,
    }
  ];

  public barChartColors: Array<any> = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1,
    },
    {
      backgroundColor: [
        'rgba(255, 125, 158, 0.2)',
        'rgba(3, 111, 184, 0.2)',
        'rgba(255, 255, 137, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(126, 243, 243, 0.2)',
        'rgba(255, 210, 115, 0.2)'
      ],
      borderColor: [
        'rgba(255, 125, 158, 1)',
        'rgba(3, 111, 184, 1)',
        'rgba(255, 255, 137, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(126, 243, 243, 1)',
        'rgba(255, 210, 115, 1)'
      ],
      borderWidth: 1,
    },
    ];
  public chartOptions: any = {
    responsive: true
  };

  public barChartOptions: any = {
    responsive: true,
      scales: {
        xAxes: [{
          stacked: true
          }],
        yAxes: [
        {
          stacked: true
        }
      ]
    }
  };

  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

  public barChartClicked(e: any): void { }
  public barChartHovered(e: any): void { }
  
  constructor() { }
  ngOnInit(): void {
  }

}
