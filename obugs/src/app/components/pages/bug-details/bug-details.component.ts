import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { QUERY_ENTRY_DETAILS, QUERY_LIST_TAGS, QUERY_MY_VOTE, QueryResponseEntryDetails, QueryResponseListTags, QueryResponseMyVote } from "src/app/models/graphql/queries";
import { MUTATION_COMMENT_ENTRY, MUTATION_PROCESS_PATCH, MUTATION_SUBMIT_PATCH, MUTATION_VOTE, MutationResponseCommentEntry, MutationResponseProcessPatch, MutationResponseSubmitPatch, MutationResponseVote } from "src/app/models/graphql/mutations";
import { QUERY_ENTRY_MESSAGES, QueryResponseEntryMessages } from "src/app/models/graphql/queries";
import { Entry, EntryMessage, Error, ProcessPatchSuccess, Tag, VoteUpdate } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs'
import { Recaptchav2Service } from 'src/app/services/recaptchav2.service';

@Component({
  selector: 'app-bug-details',
  templateUrl: './bug-details.component.html',
  styleUrls: ['./bug-details.component.scss']
})
export class BugDetailsComponent implements OnInit, OnDestroy {

  softwareId: String | null = null;
  softwareTags: Tag[] = [];
  softwareTagsAsStrings: string[] = [];
  entryId: String | null = null;
  entry: Entry | null = null;
  entryMessages: EntryMessage[] = [];
  messagesLimit: number = 50;
  messagesHasMore: boolean = false;

  subscription: Subscription | null = null;
  errorMessage: string = "";

  myVote: string | null = null;
  ratingTotal: number = 2;
  ratingCount: number = 1;

  editPanelIndex: number = 0;

  editComment: string = "";
  editTitle: string = "";
  editStatus: string = "NEW";
  editTags: string[] = [];
  editIllustration: string = "";
  editDescription: string = "";

  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    public auth: AuthService,
    private recaptchav2Service: Recaptchav2Service
  ) { }

  ngOnInit(): void {
    this.recaptchav2Service.recaptchav2$.subscribe((token) => {
      this.onSubmit(token)
    });
    this.softwareId = this.route.snapshot.paramMap.get("software");
    let id = this.route.snapshot.paramMap.get("entry");
    if (id != null) {
      this.entryId = id
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
        this.ratingCount = response.data.entry.ratingCount
        this.ratingTotal = response.data.entry.ratingTotal
        this.resetEditsWithEntry()
      });

    // MY VOTE
    this.apollo
      .query<QueryResponseMyVote>({
        query: QUERY_MY_VOTE,
        variables: {
          subjectId: this.entryId,
        }
      })
      .subscribe((response) => {
        if (response.data && response.data.myVote) {
          this.myVote = response.data.myVote.rating.toString();
        };
      });

    // MESSAGES
    this.fetchMoreMessages()

    // Software tags
    this.apollo
      .query<QueryResponseListTags>({
        query: QUERY_LIST_TAGS,
        variables: {
          softwareId: this.softwareId
        }
      })
      .subscribe((response) => {
        this.softwareTags = response.data.tags;
        this.softwareTagsAsStrings = []
        for (var tag of response.data.tags) {
          this.softwareTagsAsStrings.push(tag.name);
        }
        for (let tag of this.editTags) {
          const index = this.softwareTagsAsStrings.indexOf(tag);
          if (index != -1) {
            this.softwareTagsAsStrings.splice(index, 1);
          }
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe()
  }

  fetchMoreMessages(): void {
    this.apollo.query<QueryResponseEntryMessages>({
      query: QUERY_ENTRY_MESSAGES,
      variables: {
        entryId: this.entryId,
        limit: this.messagesLimit,
        offset: this.entryMessages.length
      }
    }).subscribe((response) => {
      if (response.data && response.data.entryMessages) {
        if (response.data.entryMessages.length == this.messagesLimit) {
          this.messagesHasMore = true;
        } else {
          this.messagesHasMore = false;
        }

        for (let message of response.data.entryMessages) {
          this.entryMessages.push(message)
        }
      }
    })
  }

  resetEditsWithEntry(): void {
    this.editComment = ""
    if (this.entry) {
      this.editStatus = this.entry.status;
      this.editTitle = this.entry.title;
      for (let tag of this.entry.tags) {
        this.editTags.push(tag.name)
        const index = this.softwareTagsAsStrings.indexOf(tag.name);
        if (index != -1) {
          this.softwareTagsAsStrings.splice(index, 1);
        }
      }
      this.editDescription = this.entry.description;
      this.editIllustration = this.entry.illustration;
    }
  }

  onVoteChange(): void {
    this.apollo.mutate<MutationResponseVote>({
      mutation: MUTATION_VOTE,
      variables: {
        subjectId: this.entryId,
        rating: parseInt(this.myVote!)
      }
    }).subscribe((response) => {
      if (response.data && response.data.vote) {
        const result = response.data.vote
        if (result.__typename === 'Error') {
          const error = result as Error;
          console.log(error)
        } else {
          const vote = result as VoteUpdate
          this.ratingCount = vote.ratingCount
          this.ratingTotal = vote.ratingTotal
        }
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

  onSubmitButton() {
    grecaptcha.execute()
  }

  onSubmit(token: string): void {
    if (this.editPanelIndex == 0) {
      // COMMENT
      if (this.editComment == '') return;
      this.errorMessage = '';
      this.apollo.mutate<MutationResponseCommentEntry>({
        mutation: MUTATION_COMMENT_ENTRY,
        variables: {
          recaptcha: token,
          entryId: this.entryId,
          comment: this.editComment
        }
      }).subscribe((response) => {
        grecaptcha.reset()
        if (response.data && response.data.commentEntry) {
          const result = response.data.commentEntry
          if (result.__typename === 'Error') {
            const error = result as Error;
            this.errorMessage = error.message;
          } else {
            const message = result as EntryMessage
            this.entryMessages.push(message);
            this.editComment = "";
          }
        }
      })

    } else if (this.editPanelIndex == 1) {
      // PATCH
      if (this.editTitle == this.entry?.title &&
        this.editIllustration == this.entry.illustration &&
        this.editDescription == this.entry.description &&
        this.equalTags(this.entry.tags, this.editTags) &&
        this.editStatus == this.entry.status)
        return;

      this.apollo.mutate<MutationResponseSubmitPatch>({
        mutation: MUTATION_SUBMIT_PATCH,
        variables: {
          recaptcha: token,
          entryId: this.entryId,
          title: this.editTitle,
          status: this.editStatus,
          tags: this.editTags,
          description: this.editDescription,
          illustration: this.editIllustration
        }
      }).subscribe((response) => {
        grecaptcha.reset()
        if (response.data && response.data.submitPatch) {
          const result = response.data.submitPatch
          if (result.__typename === 'Error') {
            const error = result as Error;
            this.errorMessage = error.message;
          } else {
            const message = result as EntryMessage
            this.editPanelIndex = 0;
            this.resetEditsWithEntry()
            this.entryMessages.push(message);
          }
        }
      })
    }
  }

  equalTags(entryTags: Tag[], editTags: string[]): boolean {
    if (entryTags.length != editTags.length) return false;

    let stringCopy: string[] = [];
    for (let tag of entryTags) {
      stringCopy.push(tag.name)
    }
    stringCopy.sort();
    editTags.sort();
    for (let i = 0; i < stringCopy.length; i++) {
      if (stringCopy[i] !== editTags[i]) {
        return false;
      }
    }
    return true;
  }

  processPatch(message: EntryMessage, accept: boolean) {
    this.apollo.mutate<MutationResponseProcessPatch>({
      mutation: MUTATION_PROCESS_PATCH,
      variables: {
        messageId: message.id,
        accept: accept
      }
    }).subscribe((response) => {
      if (response.data && response.data.processPatch) {
        const result = response.data.processPatch
        if (result.__typename === 'Error') {
          const error = result as Error;
          console.log(error.message);
        } else {
          const pps = result as ProcessPatchSuccess
          this.entry = pps.entry
          this.entryMessages = this.entryMessages.map((message) => {
            if (message.id === pps.entryMessage.id) {
              return pps.entryMessage;
            } else {
              return message;
            }
          })
          this.resetEditsWithEntry()
        }
      }
    })
  }

  removeMessage(deletedMessage: EntryMessage) {
    this.entryMessages = this.entryMessages.filter(
      (message) => message.id !== deletedMessage.id
    );
  }
}
