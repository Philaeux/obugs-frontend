import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent implements OnInit {

  messageLogin: string = "";
  errorLogin: string = "";

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
  ) {
    this.title.setTitle('oBugs - Login')
  }

  ngOnInit(): void {
    const error = this.route.snapshot.queryParamMap.get('error');
    const jwt = this.route.snapshot.queryParamMap.get('jwt');

    if (error != null) {
      this.errorLogin = error
    }
    if (jwt != null) {
      this.authService.login(jwt).pipe(untilDestroyed(this)).subscribe((response) => {
        this.router.navigate(["/apps"])
      })
    }
  }

  onLoginWithGithub() {
    const githubOauth = environment.obugsBackend + "/oauth/github/start"
    window.open(githubOauth, "_self")
  }

  onLoginWithReddit() {
    const githubOauth = environment.obugsBackend + "/oauth/reddit/start"
    window.open(githubOauth, "_self")
  }
}
