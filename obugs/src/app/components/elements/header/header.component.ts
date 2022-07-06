import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input()
  subtitle?: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log(this.subtitle);
  }

  goToHome() {
    this.router.navigate(["/"]);
  }

  goToDashboard() {
    this.router.navigate(["/s/" + this.subtitle + "/dashboard"]);
  }
}
