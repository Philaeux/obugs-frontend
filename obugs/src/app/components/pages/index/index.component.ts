import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SoftwareService } from "../../../services/software.service";
import { Software, SoftwareArrayPayload } from "../../../models/models";
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  public softwares: Software[] = [];

  constructor(
    private router: Router,
    private softwareService: SoftwareService,
    public socialAuthService: SocialAuthService
  ) { }

  ngOnInit(): void {
    this.refreshListSoftware();
  }

  selectSoftware(software: string) {
    this.router.navigate(["/s/" + software]);
  }

  refreshListSoftware() {
    this.softwareService.getSoftwareList().subscribe((data: SoftwareArrayPayload) => {
      if (data.error != null) {
        console.log(data.error);
      } else {
        this.softwares = data.payload;
      }
    })
  }
}
