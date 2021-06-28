import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { AppState } from 'src/app/state_management/_states/auth.state';
import { TermConditionPageComponent } from './term-condition-page/term-condition-page.component';
@Component({
  selector: 'app-dahboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {


  constructor(
    private router: Router,
    public translate: TranslateService,
    public authorizationService: AuthorizationService,
    private store: Store<AppState>,
    public dialog: MatDialog
    ) {

  }

  ngOnInit(): void {

  }
}
