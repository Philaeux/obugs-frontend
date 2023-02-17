import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Software} from "../../../models/software";
import {AuthService} from "../../../services/auth.service";
import { async } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input()
  software: Software | undefined;

  constructor(public authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {

  }

  goToHome() {
    this.router.navigate(["/"]);
  }

  goToDashboard() {
    this.router.navigate(["/s/" + this.software!.code + "/dashboard"]);
  }

  loginWithGoogle() {
    this.authService
      .loginWithGoogle()
      .then(() => { console.log(this.authService.afAuth.currentUser)})
      .catch((e) => console.log(e.message));
  }

  loginWithTwitter() {
    this.authService
      .loginWithTwitter()
      .then(() => { console.log(this.authService.afAuth.currentUser?.getIdToken())})
      .catch((e) => console.log(e.message));
  }
}
