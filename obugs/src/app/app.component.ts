import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthService } from './services/auth.service';
import { User } from './models/models';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {

  darkMode = false;

  currentUrl: string = "";
  currentUser: User | null = null;
  currentSoftwareId: string | null = null;

  constructor(
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode !== null) {
      this.darkMode = JSON.parse(storedDarkMode);
    }

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event) => {
      let e = event as NavigationEnd
      this.currentUrl = e.url;
    })

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.route),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })).subscribe(data => this.currentSoftwareId = data.snapshot.params['software'])

    this.auth.currentUser$.subscribe((user) => {
      if (user === undefined) return;
      this.currentUser = user;
    })
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', JSON.stringify(this.darkMode));
  }

  handleMiddleMouseClick(event: MouseEvent, link: string) {
    if (event.button === 1) {
      const url = this.router.createUrlTree([link]).toString();
      window.open(url, '_blank');
    }
  }
}
