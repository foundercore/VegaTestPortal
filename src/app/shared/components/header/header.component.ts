import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class HeaderComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit(): void {}
  logout(): void {
    localStorage.removeItem('authInfo');
    localStorage.removeItem('authState');
    this.router.navigate(['/login']);
  }
}
