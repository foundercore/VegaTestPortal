import { Component, OnInit } from '@angular/core';
import {
  faSearch,
  faHome,
  faBars,
  faFile,
  faChartLine,
  faInbox,
  faFilm,
  faCalendar,
  faUsers,
  faCog,
  faFileAlt,
  faQuestion,
} from '@fortawesome/free-solid-svg-icons';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  faSearch = faSearch;
  faHome = faHome;
  faBars = faBars;
  faFile = faFile;
  faChartLine = faChartLine;
  faInbox = faInbox;
  faFilm = faFilm;
  faCalender = faCalendar;
  faUsers = faUsers;
  faCog = faCog;
  faFileText = faFileAlt;
  faQuestion = faQuestion;

  constructor(public authorizationService: AuthorizationService) {}

  ngOnInit(): void {}

  toggleNav() {
    document.querySelector('.sidenav')!.classList.toggle('nav--open');
    setTimeout(() => {
      if (document.querySelector('.nav--open p'))
        document.querySelectorAll('.nav--open p').forEach((e) => {
          e.setAttribute('style', 'display: inline;');
          // style.display = "inline";
        });
    }, 200);
    setTimeout(() => {
      if (!document.querySelector('.nav--open p'))
        document.querySelectorAll('.sidenav p').forEach((e) => {
          e.setAttribute('style', 'display: none;');
          // e.style.display = "none";
        });
    }, 100);
  }
}
