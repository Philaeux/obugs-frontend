import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { QUERY_LIST_SOFTWARE, QueryResponseListSoftware } from "src/app/models/graphql/queries/software";
import { Software } from 'src/app/models/models';
import { Location } from '@angular/common';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss']
})
export class AppsComponent {
  softwares: Software[] = [];
  softwareFilter: string = "";

  constructor(
    private router: Router,
    private apollo: Apollo,
    private location: Location,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const search = this.route.snapshot.queryParams['search'];
    if (search != undefined) this.softwareFilter = search

    this.refreshListSoftware();
  }

  selectSoftware(software: string) {
    this.router.navigate(["/s/" + software]);
  }

  refreshListSoftware() {
    let search: string | null = null;
    if (this.softwareFilter != '') {
      search = this.softwareFilter;
      this.location.go(location.pathname, new URLSearchParams({ search: search }).toString())
    }

    this.apollo
      .query<QueryResponseListSoftware>({
        query: QUERY_LIST_SOFTWARE,
        variables: {
          search: search
        }
      })
      .subscribe((response) => {
        this.softwares = response.data.softwares;
      });
  }

  onEnterKey() {
    this.refreshListSoftware();
  }
}
