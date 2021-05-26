import { RetriveState } from './state_management/_actions/user.action';
import { Component, HostListener } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from './state_management/_states/auth.state';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Vega Test App';

  subscription: Subscription;


  constructor(
    private router: Router,
    private store: Store<AppState>,
    private translate: TranslateService
  ) {
    this.subscription = router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          if(!router.navigated){
            this.store.dispatch(new RetriveState);
          }
        }
    });
    translate.setDefaultLang('en');
  }

  @HostListener('window:beforeunload')
  savingData() {
    console.log("Processing before unload...");
    this.store.select('appState').subscribe(data =>
      {
        localStorage.setItem('state', JSON.stringify(data))
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
