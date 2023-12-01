import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Entry, EntryMessage, OBugsError, ProcessPatchSuccess, Tag, VoteUpdate } from 'src/app/models/models';
import { Recaptchav2Service } from 'src/app/services/recaptchav2.service';
import { Title } from '@angular/platform-browser';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-bug-details',
  templateUrl: './bug-details.component.html',
  styleUrls: ['./bug-details.component.scss']
})
export class BugDetailsComponent implements OnInit {

  softwareId: string | null = null;
  softwareTags: Tag[] = [];
  softwareTagsAsStrings: string[] = [];
  entryId: string | null = null;
  entry: Entry | null = null;
  entryMessages: EntryMessage[] = [];
  messagesLimit: number = 50;
  messagesHasMore: boolean = false;

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
    private api: ApiService,
    private recaptchav2Service: Recaptchav2Service,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    public auth: AuthService,
  ) { }

  ngOnInit(): void {
    const s = this.route.snapshot.paramMap.get("software");
    if (s == null) {
      this.router.navigate(["/apps"]);
    } else {
      this.softwareId = s
    }

    const id = this.route.snapshot.paramMap.get("entry");
    if (id == null) {
      this.router.navigate(["/s/" + this.softwareId]);
    } else {
      this.entryId = id
    }

    this.recaptchav2Service.recaptchav2$.pipe(untilDestroyed(this)).subscribe((token) => {
      this.onSubmit(token)
    });

    this.auth.currentUser$.pipe(untilDestroyed(this)).subscribe((user) => {
      if (user === undefined || user === null) return;
      if (this.entryId != undefined) {
        this.api.voteGet(this.entryId).subscribe((response) => {
          if (response.data && response.data.myVote) {
            this.myVote = response.data.myVote.rating.toString();
          }
        })
      }
    })

    if (this.entryId != undefined) {
      this.api.entryDetails(this.entryId).subscribe((response) => {
        this.title.setTitle(response.data.entry.title)
        this.entry = response.data.entry
        this.ratingCount = response.data.entry.ratingCount
        this.ratingTotal = response.data.entry.ratingTotal
        this.resetEditsWithEntry()
      })
    }

    // MESSAGES
    this.fetchMoreMessages()

    // Software tags
    if (this.softwareId != undefined) {
      this.api.tagList(this.softwareId, '').subscribe((response) => {
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
      })
    }
  }

  fetchMoreMessages(): void {
    if (this.entryId == undefined) return
    this.api.messageList(this.entryId, this.messagesLimit, this.entryMessages.length).subscribe((response) => {
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
      for (let tag of this.entry.tags.edges) {
        this.editTags.push(tag.node.name)
        const index = this.softwareTagsAsStrings.indexOf(tag.node.name);
        if (index != -1) {
          this.softwareTagsAsStrings.splice(index, 1);
        }
      }
      this.editDescription = this.entry.description;
      this.editIllustration = this.entry.illustration;
    }
  }

  onVoteChange(): void {
    if (this.entryId == undefined || this.myVote == null) return
    this.api.voteSet(this.entryId, parseInt(this.myVote)).subscribe((response) => {
      if (response.data && response.data.vote) {
        const result = response.data.vote
        if (result.__typename === 'OBugsError') {
          const error = result as OBugsError;
          console.log(error)
        } else {
          const vote = result as VoteUpdate
          this.ratingCount = vote.ratingCount
          this.ratingTotal = vote.ratingTotal
        }
      }
    })
  }

  linkIcon(raw_link: string): string {
    // Regular expression to match YouTube URLs
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//;
    const twitchRegex = /^(https?:\/\/)?(www\.)?((clips\.)?twitch\.tv)\//;
    const githubRegex = /^(https?:\/\/)?(www\.)?(github\.com|user-images\.githubusercontent\.com)\//;
    const imgurRegex = /^(https?:\/\/)?(www\.)?((i\.)?imgur\.com)\//;
    const redditRegex = /^(https?:\/\/)?(www\.)?((old\.)?reddit\.com|(preview\.)redd\.it)\//;

    var link = raw_link.toLowerCase()

    if (link.includes('.mp4')) {
      return 'fa fa-film'
    } else if (link.includes(".jpg") || link.includes(".jpeg") || link.includes(".gif") || link.includes(".png")) {
      return 'fa fa-image'
    }

    if (youtubeRegex.test(link)) {
      return 'fab fa-youtube';
    } else if (twitchRegex.test(link)) {
      return 'fab fa-twitch';
    } else if (githubRegex.test(link)) {
      return 'fab fa-github';
    } else if (imgurRegex.test(link)) {
      return 'imgur.png';
    } else if (redditRegex.test(link)) {
      return 'reddit.png';
    }

    return 'fa-solid fa-link'
  }

  onSubmitButton() {
    grecaptcha.execute()
  }

  onSubmit(token: string): void {
    this.errorMessage = '';
    if (this.editPanelIndex == 0) {
      // COMMENT
      if (this.editComment == '' || this.entryId == undefined) return;
      this.api.messageAdd(token, this.entryId, this.editComment).subscribe((response) => {
        grecaptcha.reset()
        if (response.data && response.data.commentEntry) {
          const result = response.data.commentEntry
          if (result.__typename === 'OBugsError') {
            const error = result as OBugsError;
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
        this.equalTags(this.entry.tags.edges, this.editTags) &&
        this.editStatus == this.entry.status)
        return;
      if (this.entryId == undefined) return

      this.api.patchAdd(token, this.entryId, this.editTitle, this.editStatus, this.editTags, this.editDescription, this.editIllustration).subscribe((response) => {
        grecaptcha.reset()
        if (response.data && response.data.submitPatch) {
          const result = response.data.submitPatch
          if (result.__typename === 'OBugsError') {
            const error = result as OBugsError;
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

  equalTags(entryTags: { node: Tag }[], editTags: string[]): boolean {
    if (entryTags.length != editTags.length) return false;

    let stringCopy: string[] = [];
    for (let tag of entryTags) {
      stringCopy.push(tag.node.name)
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
    this.api.patchProcess(message.id, accept).subscribe((response) => {
      if (response.data && response.data.processPatch) {
        const result = response.data.processPatch
        if (result.__typename === 'OBugsError') {
          const error = result as OBugsError;
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
