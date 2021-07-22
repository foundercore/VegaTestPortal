import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RoutesRecognized } from '@angular/router';
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

  public nonClickCrumbs:Breadcrumb[] = [];

  constructor(public activatedRoute: ActivatedRoute, public router: Router) {

    this.crumbs$ = this.router.events.pipe(
      // only continue if routing has completed
      filter(event => event instanceof RoutesRecognized),

      map((event: RoutesRecognized) => event.state.root.firstChild),

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
        const urlSegment = routeSnapshot.url[0].path;
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
    this.nonClickCrumbs = [];
    return crumbs;
  }


  public pushOnClickCrumb(crumb: Breadcrumb){
    this.nonClickCrumbs.push(crumb);
  }

}
