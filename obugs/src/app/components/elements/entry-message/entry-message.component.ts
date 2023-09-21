import { Component, Input, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { QUERY_USER_DETAILS, QueryResponseUserDetails } from 'src/app/models/graphql/queries';
import { EntryMessage } from 'src/app/models/models';

@Component({
  selector: 'app-entry-message',
  templateUrl: './entry-message.component.html',
  styleUrls: ['./entry-message.component.scss']
})
export class EntryMessageComponent implements OnInit {
  @Input({ required: true })
  message!: EntryMessage;

  userNickname: string | null = null;

  stateAfter: any;

  constructor(
    private apollo: Apollo
  ) { }


  ngOnInit(): void {
    if (this.message.stateAfter) {
      this.stateAfter = JSON.parse(this.message.stateAfter)
    }

    this.apollo
      .query<QueryResponseUserDetails>({
        query: QUERY_USER_DETAILS,
        variables: {
          userId: this.message.userId,
        }
      })
      .subscribe((response) => {
        this.userNickname = response.data.user.username;
      });
  }

}
