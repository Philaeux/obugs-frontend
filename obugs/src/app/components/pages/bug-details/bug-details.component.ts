import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { QUERY_ENTRY_DETAILS, QueryResponseEntryDetails } from "src/app/models/graphql/queries";
import { QUERY_MY_VOTE, QueryResponseMyVote } from "src/app/models/graphql/queries";
import { MUTATION_VOTE_ON_ENTRY, MutationResponseVoteOnEntry } from "src/app/models/graphql/mutations";
import { QUERY_ENTRY_MESSAGES, QueryResponseEntryMessages } from "src/app/models/graphql/queries";
import { Entry, EntryMessage } from 'src/app/models/models';
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
  entryMessages: EntryMessage[] = [];

  software?: Software;
  myVote: string | null = null;

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

    // BUG INFO
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

    // MY VOTE
    this.apollo
      .query<QueryResponseMyVote>({
        query: QUERY_MY_VOTE,
        variables: {
          entryId: this.entryId,
        }
      })
      .subscribe((response) => {
        if (response.data && response.data.myVote) {
          this.myVote = response.data.myVote.rating.toString();
        };
      });

    // MESSAGES
    this.apollo.query<QueryResponseEntryMessages>({
      query: QUERY_ENTRY_MESSAGES,
      variables: {
        entryId: this.entryId
      }
    }).subscribe((response) => {
      if (response.data && response.data.entryMessages) {
        this.entryMessages = response.data.entryMessages;
      }
    })
  }

  onVoteChange(): void {
    this.apollo.mutate<MutationResponseVoteOnEntry>({
      mutation: MUTATION_VOTE_ON_ENTRY,
      variables: {
        entryId: this.entryId,
        rating: parseInt(this.myVote!)
      }
    }).subscribe((response) => {
      if (response.data && response.data.voteOnEntry) {
        this.entry = response.data?.voteOnEntry
      }
    })
  };

  linkIcon(link: string): string {
    // Regular expression to match YouTube URLs
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//;
    const twitchRegex = /^(https?:\/\/)?(www\.)?((clips\.)?twitch\.tv)\//;
    const githubRegex = /^(https?:\/\/)?(www\.)?(github\.com|user-images\.githubusercontent\.com)\//;
    const imgurRegex = /^(https?:\/\/)?(www\.)?((i\.)?imgur\.com)\//;

    if (youtubeRegex.test(link)) {
      return 'fab fa-youtube';
    } else if (twitchRegex.test(link)) {
      return 'fab fa-twitch';
    } else if (githubRegex.test(link)) {
      return 'fab fa-github';
    } else if (imgurRegex.test(link)) {
      return 'imgur.png';
    }

    return 'fa-solid fa-link'
  }

}
