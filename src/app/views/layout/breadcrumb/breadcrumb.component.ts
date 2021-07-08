import { Component, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BreadcrumbNavService } from './breadcrumb-nav.service';


@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {


  constructor(public service: BreadcrumbNavService) {

  }

  ngOnInit() {

  }



}

