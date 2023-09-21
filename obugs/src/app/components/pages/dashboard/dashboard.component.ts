import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Entry } from "../../../models/models";
import { Apollo } from 'apollo-angular';
import { QUERY_LIST_ENTRIES, QueryResponseListEntries } from "src/app/models/graphql/queries";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  softwareId: string | null = null;

  entryMixed: Entry[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apollo: Apollo
  ) { }

  ngOnInit(): void {
    this.softwareId = this.route.snapshot.paramMap.get("software");
    if (this.softwareId == null) {
      this.router.navigate(["/"]);
    }

    this.apollo
      .subscribe<QueryResponseListEntries>({
        query: QUERY_LIST_ENTRIES,
        variables: {
          softwareId: this.softwareId
        }
      })
      .subscribe((response) => {
        if (response.data) {
          this.entryMixed = response.data.entries;
        }
      });
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

  openBugDetails(entry: Entry) {
    this.router.navigate([`s/${entry.softwareId}/${entry.id}`]);
  }
}
