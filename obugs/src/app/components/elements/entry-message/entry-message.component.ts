import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { diff_match_patch as DiffMatchPatch } from 'diff-match-patch';
import { EntryMessage, OBugsError, VoteUpdate, User, OperationDone } from 'src/app/models/models';

@Component({
  selector: 'app-entry-message',
  templateUrl: './entry-message.component.html',
  styleUrls: ['./entry-message.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EntryMessageComponent implements OnInit {
  @Input({ required: true }) message!: EntryMessage;
  @Input({ required: true }) softwareId: string | null = null;

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
    private api: ApiService,
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

    this.api.userDetails(this.message.userId).subscribe((response) => {
      this.messageUser = response.data.user;
    });

    if (this.auth.current_user != null && this.message.type == 'patch') {
      this.api.voteGet(this.message.id).subscribe((response) => {
        if (response.data.myVote) {
          this.petitionVote = response.data.myVote.rating;
        }
      })
    }

    if (this.message.type == 'patch' && this.message.isClosed != null && this.message.isClosed && this.message.closedById != null) {
      this.api.userDetails(this.message.closedById).subscribe((response) => {
        if (response.data.user.githubName != null) {
          this.closedByNickname = response.data.user.githubName + ' (Github User)'
        } else if (response.data.user.redditName != null) {
          this.closedByNickname = response.data.user.redditName + ' (Reddit User)'
        } else {
          this.closedByNickname = response.data.user.username + ' (oBugs User)'
        }
      })
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

    return this.newLineConvert(unifiedText);
  }

  newLineConvert(source: string) {
    return source.replace(/\n/g, '<br/>')
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

      this.api.voteSet(this.message.id, this.petitionVote).subscribe((response) => {
        if (response.data && response.data.vote) {
          const result = response.data.vote
          if (result.__typename === 'OBugsError') {
            const error = result as OBugsError
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
    if (this.messageUser != null && this.messageUser != undefined) {
      this.api.userBan(this.messageUser.id, ban).subscribe((response) => {
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
  }

  deleteMessage() {
    this.api.messageDelete(this.message.id).subscribe((response) => {
      if (response.data && response.data.deleteMessage) {
        const result = response.data.deleteMessage
        if (result.__typename === 'OBugsError') {
          const error = result as OBugsError;
          console.log(error)
        } else {
          const user = result as OperationDone;
          this.messageDeleted.emit(this.message)
        }
      }
    })
  }
}
