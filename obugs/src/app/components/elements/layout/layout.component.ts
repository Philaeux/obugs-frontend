import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  darkMode = false;
  softwareId: string | null = null;

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode !== null) {
      this.darkMode = JSON.parse(storedDarkMode);
    }

    this.route.paramMap.subscribe(params => {
      this.softwareId = params.get('software');
    });

    if (this.auth.current_user == null) {
      this.auth.initUserIfNecessary()
    }
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', JSON.stringify(this.darkMode));
  }

}
