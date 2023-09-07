import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Software, SoftwareArrayPayload } from "../../../models/models";
import { Apollo } from 'apollo-angular';
import { QUERY_LIST_SOFTWARE } from 'src/app/models/graphql';
import { QueryResponseListSoftware } from 'src/app/models/graphql';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  public softwares: Software[] = [];
  displayedColumns: string[] = ['fullName', 'editor'];

  constructor(
    private router: Router,
    private apollo: Apollo,
    private authService: AuthService
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
      },
        (error) => {
          console.log(error);
        });
  }
}
