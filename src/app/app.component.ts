import { RetriveState } from './state_management/_actions/user.action';
import { Component, HostListener } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from './state_management/_states/auth.state';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { TermConditionPageComponent } from './views/term-condition-page/term-condition-page.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Vega Test App';

  subscription: Subscription;

  dialogRef = null;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private translate: TranslateService,
     public dialog: MatDialog
  ) {
    this.subscription = router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          if(!router.navigated){
            this.store.dispatch(new RetriveState);
          }
        }
    });
    translate.setDefaultLang('en');
    this.store.select('appState').subscribe(data =>
      {
        if(data?.user?.acceptedTerms == false && this.dialogRef == null) {
          this.dialogRef = this.dialog.open(TermConditionPageComponent, { disableClose: true , data: data?.user});
          this.dialogRef.afterClosed().subscribe(result => {
            this.dialogRef = null;
          });
        }
      });
  }

  @HostListener('window:beforeunload')
  savingData() {
    console.log("Processing before unload...");
    this.store.select('appState').subscribe(data =>
      {
        sessionStorage.setItem('state', JSON.stringify(data))
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
