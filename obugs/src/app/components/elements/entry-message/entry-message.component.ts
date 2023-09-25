import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { QUERY_USER_DETAILS, QUERY_MY_VOTE, QueryResponseUserDetails, QueryResponseMyVote } from 'src/app/models/graphql/queries';
import { EntryMessage, Tag } from 'src/app/models/models';
import { diff_match_patch as DiffMatchPatch } from 'diff-match-patch';
import { AuthService } from 'src/app/services/auth.service';
import { MUTATION_VOTE, MutationResponseVote } from 'src/app/models/graphql/mutations';

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
  softwareTags!: Tag[];

  @Output() acceptPatch = new EventEmitter<EntryMessage>();
  @Output() declinePatch = new EventEmitter<EntryMessage>();

  userNickname: string | null = null;
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
      .query<QueryResponseUserDetails>({
        query: QUERY_USER_DETAILS,
        variables: {
          userId: this.message.userId,
        }
      })
      .subscribe((response) => {
        this.userNickname = response.data.user.username;
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
        console.log(response)
        if (response.data && response.data.vote) {
          this.ratingTotal = response.data?.vote.ratingTotal
          this.ratingCount = response.data?.vote.ratingCount
        }
      })
    }
  }
}
