import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Software } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-software-sidenav',
  templateUrl: './software-sidenav.component.html',
  styleUrls: ['./software-sidenav.component.scss']
})
export class SoftwareSidenavComponent implements OnInit {

  softwareId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.softwareId = this.route.snapshot.paramMap.get("software");
  }
}
