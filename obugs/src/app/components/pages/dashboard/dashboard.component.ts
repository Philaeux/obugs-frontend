import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Software, Bug } from "../../../models/models";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  software: Software | undefined;
  bugsAll: Bug[] = [];
  bugsNew: Bug[] = [];
  bugsConfirmed: Bug[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    var softwareId: string | null = this.route.snapshot.paramMap.get("software");

    if (softwareId == null) {
      this.router.navigate(["/"]);
    }
  }

  getSoftwareDetails(softwareCode: string) {/*
    this.softwareService.getSoftwareDetails(softwareCode).subscribe(data => {
      if (data.payload == null) {
        console.log(data.error)
        this.router.navigate(["/"]);
      } else {
        this.software = data.payload;
      }
    });*/
  }

  getBugsAll(softwareCode: string) {/*
    this.softwareService.getBugs(softwareCode).subscribe(data => {
      if (data.error != null) {
        console.log(data.error);
      } else {
        this.bugsAll = data.payload;
      }
    })*/
  }

  getBugsNew(softwareCode: string) {/*
    this.softwareService.getBugs(softwareCode, "NEW").subscribe(data => {
      if (data.error != null) {
        console.log(data.error);
      } else {
        this.bugsNew = data.payload;
      }
    });*/
  }

  getBugsConfirmed(softwareCode: string) {/*
    this.softwareService.getBugs(softwareCode, "CONFIRMED").subscribe(data => {
      if (data.error != null) {
        console.log(data.error)
      } else {
        this.bugsConfirmed = data.payload;
      }
    });*/
  }

  openBugDetails(bug: Bug) {
    this.router.navigate([`s/${bug.software_id}/bug/${bug.id}`]);
  }
}
