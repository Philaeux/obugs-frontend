import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Recaptchav2Service } from './services/recaptchav2.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { AuthService } from './services/auth.service';
import { User } from './models/models';
import { T } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  siteKey: string = environment.recaptchaSiteKey;
  darkMode = false;

  currentUrl: string = "";
  currentUser: User | null = null;
  currentSoftwareId: string | null = null;

  constructor(
    private captchav2Service: Recaptchav2Service,
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

  public resolved(captchaResponse: string): void {
    this.captchav2Service.recaptchav2Resolved(captchaResponse);
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
