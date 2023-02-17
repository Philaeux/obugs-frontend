import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {SoftwaresService} from "../../../services/softwares.service";
import {Software} from "../../../models/software";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  public softwares: Software[] = [];

  constructor(private router: Router, private softwaresService: SoftwaresService) { }

  ngOnInit(): void {
    this.refreshListSoftware();
  }

  selectSoftware(software: string) {
    this.router.navigate(["/s/" + software + "/dashboard"]);
  }

  refreshListSoftware() {
    this.softwaresService.getSoftwareList().subscribe((data: Software[]) =>
    {
      this.softwares = data;
    })
  }
}
