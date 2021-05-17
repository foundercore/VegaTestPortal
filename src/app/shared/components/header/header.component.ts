import { ChangePasswordComponent } from './../../../views/user/change-password/change-password.component';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LogOut } from 'src/app/state_management/_actions/user.action';
import { AppState } from 'src/app/state_management/_states/auth.state';
import {ProfileComponent } from 'src/app/views/user/profile/profile.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class HeaderComponent implements OnInit {

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private dialog: MatDialog
    ) {}

  ngOnInit(): void {}

  logout(): void {
    this.store.dispatch(new LogOut);
    this.router.navigate(['/login']);
  }

  showProfile(): void {
    const dialogRef = this.dialog.open(ProfileComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  changePassword(): void {
    const dialogRef = this.dialog.open(ChangePasswordComponent);
    dialogRef.afterClosed().subscribe(result => {
      dialogRef.close();
    });
  }

}
