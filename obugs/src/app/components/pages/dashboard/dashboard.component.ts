import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Entry, Tag } from "../../../models/models";
import { Apollo } from 'apollo-angular';
import { QUERY_LIST_ENTRIES, QueryResponseListEntries } from "src/app/models/graphql/queries/entry";
import { QUERY_LIST_TAGS, QueryResponseListTags } from "src/app/models/graphql/queries/tag";
import { Location } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  softwareId: string | null = null;

  newEntries: Entry[] = [];

  filteredEntries: Entry[] = [];
  filterHasMore: boolean = false;
  filterLimit = 20;
  searchFilter: string = "";
  statusFilter: string[] = ['CONFIRMED', 'WIP', 'CHECK'];
  orderingFilter: string = "updated";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apollo: Apollo,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.softwareId = this.route.snapshot.paramMap.get("software");
    if (this.softwareId == null || this.softwareId == undefined) this.router.navigate(["/"]);
    const search = this.route.snapshot.queryParams['search'];
    if (search != null && search != undefined) this.searchFilter = search
    const order = this.route.snapshot.queryParams['order'];
    if (order != null && order != undefined) this.orderingFilter = order
    const status: string = this.route.snapshot.queryParams['status']
    if (status != null && status != undefined) this.statusFilter = status.split(',')

    this.fetchFilteredEntries()
    this.fetchNewEntries()
  }

  fetchFilteredEntries() {
    // Entries
    this.apollo
      .subscribe<QueryResponseListEntries>({
        query: QUERY_LIST_ENTRIES,
        variables: {
          softwareId: this.softwareId,
          searchFilter: this.searchFilter,
          statusFilter: this.statusFilter,
          order: this.orderingFilter,
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
          searchFilter: null,
          statusFilter: ['NEW'],
          order: 'updated',
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

  onFiltersChange() {
    let queryParams: any = {}
    if (this.searchFilter != '') queryParams.search = this.searchFilter
    if (this.orderingFilter != 'updated') queryParams.order = this.orderingFilter
    if (!this.statusFilter.every(element => ['CONFIRMED', 'WIP', 'CHECK'].includes(element))) queryParams.status = this.statusFilter
    this.location.go(location.pathname, new URLSearchParams(queryParams).toString())

    this.filteredEntries = []
    this.fetchFilteredEntries()
  }

  getMoreFiltered() {
    this.fetchFilteredEntries()
  }
}
