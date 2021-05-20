import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-single-layer-gauge',
  templateUrl: './single-layer-gauge.component.html',
  styleUrls: ['./single-layer-gauge.component.scss']
})
export class SingleLayerGaugeComponent {

  @Input()
  title = "Average Subject Score";

  single: any[] = [  [{
    "name": "Arts",
  "value": 54.7
  }],
  [{
    "name": "English",
  "value": 60.80
  }],
  [{
    "name": "Maths",
  "value": 68.07
  }],
  [{
    "name": "Phys. Ed",
  "value": 63.26
  }],
  [{
    "name": "Science",
  "value": 80
  }],
   ];




  view: any[] = [500, 400];
  legend: boolean = false;
  legendPosition: string = 'below';



   colorScheme = [
        {
          domain: ['#816AF8']
        },
        {
          domain: ['#2D99FE']
        },
        {
          domain: [ '#2CD9C5']
        },
        {
          domain: ['#FF6C40']
        },
        {
          domain: ['#FFE600']
        },
   ];


  constructor() {
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
