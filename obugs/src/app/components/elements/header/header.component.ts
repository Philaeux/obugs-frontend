import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Software } from "../../../models/models";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input()
  software: Software | undefined;
  user: SocialUser | undefined;

  constructor(
    private router: Router,
    private authService: SocialAuthService
  ) { }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
    });
  }

  goToHome() {
    this.router.navigate(["/"]);
  }

  goToDashboard() {
    this.router.navigate(["/s/" + this.software!.id]);
  }

  signOut() {
    this.authService.signOut();
  }
}
