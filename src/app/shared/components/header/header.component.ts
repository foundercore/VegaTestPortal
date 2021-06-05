import { ChangePasswordComponent } from './../../../views/user/change-password/change-password.component';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LogOut } from 'src/app/state_management/_actions/user.action';
import { AppState } from 'src/app/state_management/_states/auth.state';
import { ProfileComponent } from 'src/app/views/user/profile/profile.component';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  nameOfUser: string;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private dialog: MatDialog,
    public translate: TranslateService,
    public authorizationService: AuthorizationService
  ) {}

  ngOnInit(): void {
    this.store.select('appState').subscribe((data: any) => {
      console.log(data);
      this.nameOfUser = data.user.firstName + ' ' + data.user.lastName;
    });
  }

  logout(): void {
    this.store.dispatch(new LogOut());
    this.router.navigate(['/login']);
  }

  showProfile(): void {
    const dialogRef = this.dialog.open(ProfileComponent);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  changePassword(): void {
    const dialogRef = this.dialog.open(ChangePasswordComponent);
    dialogRef.afterClosed().subscribe((result) => {
      dialogRef.close();
    });
  }
}
