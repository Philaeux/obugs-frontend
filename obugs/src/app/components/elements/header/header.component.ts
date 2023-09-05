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

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void { }

  goToHome() {
    this.router.navigate(["/"]);
  }

  goToDashboard() {
    this.router.navigate(["/s/" + this.software!.id]);
  }

  signOut() {

  }
}
