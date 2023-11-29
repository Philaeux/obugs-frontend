import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { Entry } from "../../../models/models";
import { Location } from '@angular/common';
import { Title } from "@angular/platform-browser";

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
    private api: ApiService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit(): void {
    this.softwareId = this.route.snapshot.paramMap.get("software");
    if (this.softwareId == null || this.softwareId == undefined || this.softwareId == "") this.router.navigate(["/apps"]);

    const search = this.route.snapshot.queryParams['search'];
    if (search != null && search != undefined) this.searchFilter = search
    const order = this.route.snapshot.queryParams['order'];
    if (order != null && order != undefined) this.orderingFilter = order

    const status: string = this.route.snapshot.queryParams['status']
    if (status != null && status != undefined) this.statusFilter = status.split(',')

    this.title.setTitle("oBugs " + this.softwareId)
    this.fetchFilteredEntries()
    this.fetchNewEntries()
  }

  fetchFilteredEntries() {
    if (this.softwareId == null) return
    this.api.entryList(
      this.softwareId,
      this.searchFilter,
      this.statusFilter,
      this.orderingFilter,
      this.filterLimit,
      this.filteredEntries.length
    ).subscribe((response) => {
      if (response.data) {
        if (response.data.entries.length == this.filterLimit) {
          this.filterHasMore = true
        } else {
          this.filterHasMore = false
        }
        for (let entry of response.data.entries) {
          this.filteredEntries.push(entry)
        }
      }
    })
  }

  fetchNewEntries() {
    if (this.softwareId == null) return
    this.api.entryList(this.softwareId, '', ['NEW'], 'updated', 20, 0).subscribe((response) => {
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
    if (!['CONFIRMED', 'WIP', 'CHECK'].every(element => this.statusFilter.includes(element))) {
      queryParams.status = this.statusFilter
    }
    this.location.go(location.pathname, new URLSearchParams(queryParams).toString())

    this.filteredEntries = []
    this.fetchFilteredEntries()
  }

  getMoreFiltered() {
    this.fetchFilteredEntries()
  }
}
