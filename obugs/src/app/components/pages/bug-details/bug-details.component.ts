import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { QUERY_ENTRY_DETAILS, QUERY_LIST_TAGS, QUERY_MY_VOTE, QueryResponseEntryDetails, QueryResponseListTags, QueryResponseMyVote } from "src/app/models/graphql/queries";
import { MUTATION_COMMENT_ENTRY, MUTATION_PROCESS_PATCH, MUTATION_SUBMIT_PROPOSITION, MUTATION_VOTE, MutationResponseCommentEntry, MutationResponseProcessPatch, MutationResponseSubmitProposition, MutationResponseVote } from "src/app/models/graphql/mutations";
import { QUERY_ENTRY_MESSAGES, QueryResponseEntryMessages } from "src/app/models/graphql/queries";
import { Entry, EntryMessage, Tag } from 'src/app/models/models';
import { Software } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-bug-details',
  templateUrl: './bug-details.component.html',
  styleUrls: ['./bug-details.component.scss']
})
export class BugDetailsComponent implements OnInit {

  softwareId: String | null = null;
  softwareTags: Tag[] = [];
  softwareTagsAsStrings: string[] = [];
  entryId: String | null = null;
  entry: Entry | null = null;
  entryMessages: EntryMessage[] = [];

  software?: Software;
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
      if (response.data && response.data.vote && this.entry) {
        this.ratingCount = response.data?.vote.ratingCount
        this.ratingTotal = response.data?.vote.ratingTotal
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

  onSendComment(): void {
    if (this.editComment == '') return;

    this.apollo.mutate<MutationResponseCommentEntry>({
      mutation: MUTATION_COMMENT_ENTRY,
      variables: {
        entryId: this.entryId,
        comment: this.editComment
      }
    }).subscribe((response) => {
      if (response.data && response.data.commentEntry) {
        this.entryMessages = response.data.commentEntry;
        this.editComment = ""
      }
    })
  }

  onProposeModification(): void {
    if (this.editTitle == this.entry?.title &&
      this.editIllustration == this.entry.illustration &&
      this.editDescription == this.entry.description &&
      this.equalTags(this.entry.tags, this.editTags) &&
      this.editStatus == this.entry.status)
      return;

    this.apollo.mutate<MutationResponseSubmitProposition>({
      mutation: MUTATION_SUBMIT_PROPOSITION,
      variables: {
        entryId: this.entryId,
        title: this.editTitle,
        status: this.editStatus,
        tags: this.editTags,
        description: this.editDescription,
        illustration: this.editIllustration
      }
    }).subscribe((response) => {
      if (response.data && response.data.submitProposition) {
        this.entryMessages = response.data.submitProposition;
        this.editPanelIndex = 0;
        this.resetEditsWithEntry()
      }
    })
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
        this.entry = response.data.processPatch.entry
        this.entryMessages = this.entryMessages.map((message) => {
          if (message.id === response.data!.processPatch.message.id) {
            return response.data!.processPatch.message;
          } else {
            return message;
          }
        })
        this.resetEditsWithEntry()
      }
    })
  }
}
