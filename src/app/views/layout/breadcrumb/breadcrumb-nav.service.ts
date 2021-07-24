import { Injectable, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, ResolveEnd, Router, RoutesRecognized } from '@angular/router';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';



export interface Breadcrumb{
  urlSegment?: string;
  route?: string;
  label: string;
}

@Injectable()
export class BreadcrumbNavService {

  public crumbs$: Observable<Breadcrumb[]>;
  public activeCrumb: Breadcrumb;

  public nonClickCrumbs = new EventEmitter<Breadcrumb>();

  constructor(public activatedRoute: ActivatedRoute, public router: Router) {

    this.crumbs$ = this.router.events.pipe(
      // only continue if routing has completed
      filter(event => event instanceof ResolveEnd),

      map((event: ResolveEnd) => event.state.root.firstChild),

      map(snapshot => this.routeSnapshotToBreadcrumb(snapshot)),

      tap(crumbs => this.activeCrumb = crumbs[crumbs.length - 1]),

    );

  }

  private routeSnapshotToBreadcrumb(snapshot: ActivatedRouteSnapshot): any[] {
    const crumbs: Breadcrumb[] = [];
    let routeSnapshot = snapshot;
    let routeFromRoot = '';

    while (routeSnapshot) {
      if (!routeSnapshot) {
        break;
      }

      if (routeSnapshot.url.length) {
        const urlSegment = routeSnapshot.url.map(x => x.path).join('/');
        const route = routeFromRoot += `/${urlSegment}`;
        const label = routeSnapshot.data.breadcrumb;
        if(label){
          crumbs.push({
            urlSegment,
            route,
            label,
          });
        }
      }
      routeSnapshot = routeSnapshot.firstChild;
    }
    this.nonClickCrumbs.emit(null);
    return crumbs;
  }


  public pushOnClickCrumb(crumb: Breadcrumb){
    this.nonClickCrumbs.emit(crumb);
  }

}
