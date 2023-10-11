import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { QUERY_LIST_SOFTWARE, QueryResponseListSoftware } from "src/app/models/graphql/queries/software";
import { Software } from 'src/app/models/models';

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
    private apollo: Apollo
  ) { }

  ngOnInit(): void {
    this.refreshListSoftware();
  }

  selectSoftware(software: string) {
    this.router.navigate(["/s/" + software]);
  }

  refreshListSoftware() {
    let search: string | null = null;
    if (this.softwareFilter != '') {
      search = this.softwareFilter;
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
