import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { QUERY_ENTRY_DETAILS, QueryResponseEntryDetails } from 'src/app/models/graphql';
import { Bug, BugDetailsPayload, BugVotePayload, Entry } from 'src/app/models/models';
import { Software } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bug-details',
  templateUrl: './bug-details.component.html',
  styleUrls: ['./bug-details.component.scss']
})
export class BugDetailsComponent implements OnInit {

  softwareId: String | null = null;
  entryId: number | null = null;
  entry: Entry | null = null;

  software?: Software;
  bug?: Bug;
  myVote?: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private apollo: Apollo,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.softwareId = this.route.snapshot.paramMap.get("software");
    let id = this.route.snapshot.paramMap.get("entry");
    if (id != null) {
      this.entryId = parseInt(id)
    }

    this.apollo
      .query<QueryResponseEntryDetails>({
        query: QUERY_ENTRY_DETAILS,
        variables: {
          entryId: this.entryId,
        }
      })
      .subscribe((response) => {
        this.entry = response.data.entry;
      });
  }

  onVoteChange(): void {
    this.http.post<BugDetailsPayload>(environment.obugsBackend + "/api/bug_vote/" + this.entryId + "/", { "vote": this.myVote }).subscribe(data => {
      if (data.payload != null) {
        this.bug = data.payload;
      }
    });
  };

}
