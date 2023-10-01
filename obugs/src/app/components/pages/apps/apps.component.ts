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
  public softwares: Software[] = [];
  displayedColumns: string[] = ['fullName', 'editor'];

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
    this.apollo
      .query<QueryResponseListSoftware>({
        query: QUERY_LIST_SOFTWARE
      })
      .subscribe((response) => {
        this.softwares = response.data.softwares;
      });
  }
}
