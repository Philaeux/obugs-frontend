import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Entry, Tag } from "../../../models/models";
import { Apollo } from 'apollo-angular';
import { QUERY_LIST_ENTRIES, QUERY_LIST_TAGS, QueryResponseListEntries, QueryResponseListTags } from "src/app/models/graphql/queries";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  softwareId: string | null = null;
  softwareTags: Tag[] = [];
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

    // Software entries
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

    // Software tags
    this.apollo
      .query<QueryResponseListTags>({
        query: QUERY_LIST_TAGS,
        variables: {
          softwareId: this.softwareId
        }
      })
      .subscribe((response) => {
        this.softwareTags = response.data.tags;
      });
  }

  openBugDetails(entry: Entry) {
    this.router.navigate([`s/${entry.softwareId}/${entry.id}`]);
  }
}
