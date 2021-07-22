import { Component, Injectable, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BreadcrumbNavService } from './breadcrumb-nav.service';
import { ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class BreadcrumbComponent implements OnInit {

  public nonClickCrumbs = [];

  constructor(public service: BreadcrumbNavService,public ref:ChangeDetectorRef) {
    this.service.nonClickCrumbs.subscribe(crumb => {
      if(crumb == null){
        this.nonClickCrumbs = [];
      }else {
        this.nonClickCrumbs.push(crumb);
        this.ref.detectChanges();
      }
    })
  }

  ngOnInit() {

  }



}

