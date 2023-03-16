import { Component, Input, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Software } from "../../../models/models";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input()
  software: Software | undefined;

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  goToHome() {
    this.router.navigate(["/"]);
  }

  goToDashboard() {
    this.router.navigate(["/s/" + this.software!.id]);
  }

  loginWithGoogle() {
  }

  loginWithTwitter() {
  }
}
