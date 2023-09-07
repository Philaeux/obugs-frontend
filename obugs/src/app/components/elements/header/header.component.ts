import { Component, Input, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Software } from "../../../models/models";
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input()
  software: Software | undefined;

  constructor(
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void { }

  goToHome() {
    this.router.navigate(["/"]);
  }

  goToDashboard() {
    this.router.navigate(["/s/" + this.software!.id]);
  }

  goToAccount() {

  }

  goToLogin() {
    this.router.navigate(["/login"]);
  }
}
