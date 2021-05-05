import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LogOut } from 'src/app/state_management/_actions/user.action';
import { AppState } from 'src/app/state_management/_states/auth.state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router,
    private store: Store<AppState>

    ) {}

  ngOnInit(): void {}

  logout(): void {
    this.store.dispatch(new LogOut);
    this.router.navigate(['/login']);
  }

}
