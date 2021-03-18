import { Component, OnInit } from '@angular/core';
import { faSearch, faHome, faBars, faFile, faChartLine, faInbox, faFilm, faCalendar, faUsers, faCog } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
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

  constructor() { }

  ngOnInit(): void {
  }

  toggleNav() {
    document.getElementById("mySidenav")!.classList.toggle("nav--open");
    setTimeout(() => {
      if (document.querySelector(".nav--open p"))
        document.querySelectorAll(".nav--open p").forEach((e) => {
          e.setAttribute("style", "display: inline;")
            // style.display = "inline";
        });
    }, 200);
    setTimeout(() => {
      if (!document.querySelector(".nav--open p"))
        document.querySelectorAll(".sidenav p").forEach((e) => {
          e.setAttribute("style", "display: none;")
          // e.style.display = "none";
        });
    }, 100);
  }

}
