import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { QUERY_MY_VOTE, QueryResponseMyVote } from "src/app/models/graphql/queries/vote";
import { QUERY_USER_DETAILS, QueryResponseUserDetails } from "src/app/models/graphql/queries/user";
import { EntryMessage, Tag, OBugsError, VoteUpdate, User } from 'src/app/models/models';
import { diff_match_patch as DiffMatchPatch } from 'diff-match-patch';
import { AuthService } from 'src/app/services/auth.service';
import { MUTATION_VOTE, MutationResponseVote } from 'src/app/models/graphql/mutations/vote';
import { MUTATION_BAN_USER, MutationResponseBanUser } from 'src/app/models/graphql/mutations/user';
import { MUTATION_DELETE_MESSAGE, MessageDeleteSuccess, MutationResponseDeleteMessage } from 'src/app/models/graphql/mutations/entry_message';

@Component({
  selector: 'app-entry-message',
  templateUrl: './entry-message.component.html',
  styleUrls: ['./entry-message.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EntryMessageComponent implements OnInit {
  @Input({ required: true })
  message!: EntryMessage;

  @Input({ required: true })
  softwareId: string | null = null;

  @Output() acceptPatch = new EventEmitter<EntryMessage>();
  @Output() declinePatch = new EventEmitter<EntryMessage>();
  @Output() messageDeleted = new EventEmitter<EntryMessage>();

  messageUser: User | null = null;
  petitionVote: number = 0;
  ratingTotal: number = 0;
  ratingCount: number = 1;
  stateBefore: any;
  stateAfter: any;
  closedByNickname: string = "";

  dmp = new DiffMatchPatch.diff_match_patch();
  showDetails: boolean = false;


  constructor(
    private apollo: Apollo,
    public auth: AuthService
  ) { }


  ngOnInit(): void {
    if (this.message.stateAfter) {
      this.stateAfter = JSON.parse(this.message.stateAfter)
    }
    if (this.message.stateBefore) {
      this.stateBefore = JSON.parse(this.message.stateBefore)
    }
    if (this.message.ratingTotal) {
      this.ratingTotal = this.message.ratingTotal;
    }
    if (this.message.ratingCount) {
      this.ratingCount = this.message.ratingCount;
    }

    this.apollo
      .watchQuery<QueryResponseUserDetails>({
        query: QUERY_USER_DETAILS,
        variables: {
          userId: this.message.userId,
        }
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.messageUser = data.user;
      });

    if (this.auth.current_user != null && this.message.type == 'patch') {
      this.apollo.query<QueryResponseMyVote>({
        query: QUERY_MY_VOTE,
        variables: {
          subjectId: this.message.id
        }
      }).subscribe((response) => {
        if (response.data.myVote) {
          this.petitionVote = response.data.myVote.rating;
        }
      })
    }

    if (this.message.type == 'patch' && this.message.isClosed != null && this.message.isClosed && this.message.closedById != null) {
      this.apollo
        .query<QueryResponseUserDetails>({
          query: QUERY_USER_DETAILS,
          variables: {
            userId: this.message.closedById,
          }
        })
        .subscribe((response) => {
          this.closedByNickname = response.data.user.username;
        });
    }
  }

  generateUnifiedText(oldText: string, newText: string): string {
    const diffs = this.dmp.diff_main(oldText, newText);
    this.dmp.diff_cleanupSemantic(diffs);

    let unifiedText = '';
    for (const [operation, text] of diffs) {
      if (operation === DiffMatchPatch.DIFF_EQUAL) {
        unifiedText += text;
      } else if (operation === DiffMatchPatch.DIFF_INSERT) {
        unifiedText += `<ins>${text}</ins>`;
      } else if (operation === DiffMatchPatch.DIFF_DELETE) {
        unifiedText += `<del>${text}</del>`;
      }
    }

    return unifiedText.replace(/\n/g, '<br />');
  }

  vote(value: number) {
    if (this.ratingCount == null || this.ratingTotal == null)
      return

    if (this.auth.current_user != null && this.message.type == 'patch' && this.petitionVote != value) {
      if (this.petitionVote == 0) {
        this.ratingCount++;
      } else {
        this.ratingTotal -= this.petitionVote;
      }
      this.petitionVote = value
      this.ratingTotal += value

      this.apollo.mutate<MutationResponseVote>({
        mutation: MUTATION_VOTE,
        variables: {
          subjectId: this.message.id,
          rating: this.petitionVote
        }
      }).subscribe((response) => {
        if (response.data && response.data.vote) {
          const result = response.data.vote
          if (result.__typename === 'OBugsError') {
            const error = result as OBugsError;
            console.log(error)
          } else {
            const vote = result as VoteUpdate
            this.ratingTotal = vote.ratingTotal
            this.ratingCount = vote.ratingCount
          }
        }
      })
    }
  }

  banUser(ban: boolean) {
    this.apollo.mutate<MutationResponseBanUser>({
      mutation: MUTATION_BAN_USER,
      variables: {
        userId: this.messageUser?.id,
        ban: ban
      }
    }).subscribe((response) => {
      if (response.data && response.data.banUser) {
        const result = response.data.banUser
        if (result.__typename === 'OBugsError') {
          const error = result as OBugsError;
          console.log(error)
        } else {
          const user = result as User;
        }
      }
    })
  }

  deleteMessage() {
    this.apollo.mutate<MutationResponseDeleteMessage>({
      mutation: MUTATION_DELETE_MESSAGE,
      variables: {
        messageId: this.message.id
      }
    }).subscribe((response) => {
      if (response.data && response.data.deleteMessage) {
        const result = response.data.deleteMessage
        if (result.__typename === 'OBugsError') {
          const error = result as OBugsError;
          console.log(error)
        } else {
          const user = result as MessageDeleteSuccess;
          this.messageDeleted.emit(this.message)
        }
      }
    })
  }
}
