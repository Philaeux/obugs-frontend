import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Entry, Tag } from "../../../models/models";
import { Apollo } from 'apollo-angular';
import { QUERY_LIST_ENTRIES, QueryResponseListEntries } from "src/app/models/graphql/queries/entry";
import { QUERY_LIST_TAGS, QueryResponseListTags } from "src/app/models/graphql/queries/tag";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  softwareId: string | null = null;
  softwareTags: Tag[] = [];
  filteredEntries: Entry[] = [];
  newEntries: Entry[] = [];
  filterLimit = 20;
  filterHasMore: boolean = false;
  statusFilter: string[] = ['CONFIRMED', 'WIP', 'CHECK'];

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

    this.fetchFilteredEntries()
    this.fetchNewEntries()

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

  fetchFilteredEntries() {
    // Entries
    this.apollo
      .subscribe<QueryResponseListEntries>({
        query: QUERY_LIST_ENTRIES,
        variables: {
          softwareId: this.softwareId,
          statusFilter: this.statusFilter,
          limit: this.filterLimit,
          offset: this.filteredEntries.length
        }
      })
      .subscribe((response) => {
        if (response.data) {
          if (response.data.entries.length == this.filterLimit) {
            this.filterHasMore = true;
          } else {
            this.filterHasMore = false;
          }
          for (let entry of response.data.entries) {
            this.filteredEntries.push(entry)
          }
        }
      });
  }

  fetchNewEntries() {
    this.apollo
      .subscribe<QueryResponseListEntries>({
        query: QUERY_LIST_ENTRIES,
        variables: {
          softwareId: this.softwareId,
          statusFilter: ['NEW'],
          limit: 20,
          offset: 0
        }
      })
      .subscribe((response) => {
        if (response.data) {
          for (let entry of response.data.entries) {
            this.newEntries.push(entry)
          }
        }
      });
  }

  handleMiddleMouseClick(event: MouseEvent, entry: Entry) {
    if (event.button === 1) {
      this.openBugDetails(entry, true);
    }
  }

  openBugDetails(entry: Entry, newTab: boolean) {
    if (newTab) {
      const url = this.router.createUrlTree([`s/${entry.softwareId}/${entry.id}`]).toString();
      window.open(url, '_blank');
    } else {
      this.router.navigate([`s/${entry.softwareId}/${entry.id}`]);
    }
  }

  onStatusFilterChange() {
    this.filteredEntries = []
    this.fetchFilteredEntries()
  }

  getMoreFiltered() {
    this.fetchFilteredEntries()
  }
}
