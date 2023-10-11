import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Software, OBugsError, Tag, EntryMessage, SoftwareSuggestion, OperationDone } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs'
import { Apollo } from 'apollo-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MUTATION_DELETE_SUGGESTION, MUTATION_UPSERT_SOFTWARE, MutationResponseDeleteSuggestion, MutationResponseUpsertSoftware } from 'src/app/models/graphql/mutations/software';
import { MUTATION_UPSERT_TAG, MutationResponseUpsertTag } from 'src/app/models/graphql/mutations/tag';
import { QUERY_LIST_SOFTWARE, QUERY_LIST_SOFTWARE_SUGGESTIONS, QueryResponseListSoftware, QueryResponseListSoftwareSuggestions } from 'src/app/models/graphql/queries/software';
import { QUERY_LIST_TAGS, QueryResponseListTags } from 'src/app/models/graphql/queries/tag';
import { QUERY_PATCHES, QueryResponsePatches } from 'src/app/models/graphql/queries/entry_message';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {


  subscription: Subscription | null = null;

  softwares: Software[] = [];
  softwareEditForm: FormGroup;

  tags: Tag[] = [];
  tagFilter: string = "";
  tagEditForm: FormGroup;

  patches: EntryMessage[] = [];
  suggestions: SoftwareSuggestion[] = [];
  selectedSuggestion: SoftwareSuggestion | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private apollo: Apollo
  ) {
    this.softwareEditForm = this.fb.group({
      id: ['', [Validators.required]],
      fullName: ['', [Validators.required]],
      editor: ['', [Validators.required]],
      language: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });

    this.tagEditForm = this.fb.group({
      id: ['', []],
      name: ['', [Validators.required]],
      softwareId: ['', [Validators.required]],
      fontColor: ['', [Validators.required]],
      backgroundColor: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.subscription = this.auth.currentUser$.subscribe((user) => {
      if (user === undefined) return;
      if (user === null || !user.isAdmin) {
        this.router.navigate([`/`]);
      }
    })

    this.fetchSoftwares();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe()
  }

  fetchSoftwares() {
    this.apollo
      .query<QueryResponseListSoftware>({
        query: QUERY_LIST_SOFTWARE,
        variables: {
          search: null
        }
      })
      .subscribe((response) => {
        this.softwares = response.data.softwares;
      });
  }

  onSoftwareSelect(software: Software) {
    this.softwareEditForm.patchValue({
      id: software.id,
      fullName: software.fullName,
      editor: software.editor,
      language: software.language,
      description: software.description
    })
  }


  refreshTagList() {
    this.apollo.query<QueryResponseListTags>({
      query: QUERY_LIST_TAGS,
      variables: {
        softwareId: this.tagFilter
      }
    }).subscribe((response) => {
      this.tags = response.data.tags
    })
  }

  onTagSelect(tag: Tag) {
    this.tagEditForm.patchValue({
      id: tag.id,
      softwareId: tag.softwareId,
      name: tag.name,
      fontColor: tag.fontColor,
      backgroundColor: tag.backgroundColor
    })
  }

  upsertSoftware() {
    if (this.softwareEditForm.valid) {
      this.apollo.mutate<MutationResponseUpsertSoftware>({
        mutation: MUTATION_UPSERT_SOFTWARE,
        variables: {
          id: this.softwareEditForm.value.id,
          fullName: this.softwareEditForm.value.fullName,
          editor: this.softwareEditForm.value.editor,
          language: this.softwareEditForm.value.language,
          description: this.softwareEditForm.value.description,
        }
      }).subscribe((response) => {
        if (response.data != null && response.data.upsertSoftware != null) {
          const data = response.data?.upsertSoftware
          if (data.__typename === 'OBugsError') {
            const error = data as OBugsError;
            console.log(error.message);
          } else {
            const software = data as Software;
            let seen = false;
            this.softwares = this.softwares.map((s) => {
              if (s.id == software.id) {
                seen = true;
                return software;
              }
              return s;
            })
            if (!seen) this.softwares.push(software)
          }
        }
      })
    }
  }

  upsertTag() {
    let variables: any = {
      id: null,
      softwareId: this.tagEditForm.value.softwareId,
      name: this.tagEditForm.value.name,
      fontColor: this.tagEditForm.value.fontColor,
      backgroundColor: this.tagEditForm.value.backgroundColor,
    }
    if (this.tagEditForm.value.id != '') {
      variables.id = this.tagEditForm.value.id
    }

    if (this.tagEditForm.valid) {
      this.apollo.mutate<MutationResponseUpsertTag>({
        mutation: MUTATION_UPSERT_TAG,
        variables: variables
      }).subscribe((response) => {
        if (response.data != null && response.data.upsertTag != null) {
          const data = response.data?.upsertTag
          if (data.__typename === 'OBugsError') {
            const error = data as OBugsError;
            console.log(error.message);
          } else {
            const tag = data as Tag;
            let seen = false;
            this.tags = this.tags.map((t) => {
              if (t.id == tag.id) {
                seen = true;
                return tag;
              }
              return t;
            })
            if (!seen) this.tags.push(tag)
          }
        }
      })
    }
  }

  refreshPatchList() {
    this.apollo.query<QueryResponsePatches>({
      query: QUERY_PATCHES,
      variables: {
        softwareId: null
      }
    }).subscribe((response) => {
      this.patches = response.data.openPatches
    })
  }

  onPatchSelect(row: EntryMessage) {
    const url = this.router.createUrlTree(['/s/' + row.entry.softwareId + '/' + row.entry.id]).toString();
    window.open(url, '_blank');
  }

  refreshSuggestionList() {
    this.apollo.query<QueryResponseListSoftwareSuggestions>({
      query: QUERY_LIST_SOFTWARE_SUGGESTIONS
    }).subscribe((response) => {
      this.suggestions = response.data.softwareSuggestions
    })
  }

  onSuggestionSelect(row: SoftwareSuggestion) {
    this.selectedSuggestion = row
  }

  deleteSuggestion() {
    this.apollo.mutate<MutationResponseDeleteSuggestion>({
      mutation: MUTATION_DELETE_SUGGESTION,
      variables: {
        suggestionId: this.selectedSuggestion?.id
      }
    }).subscribe((response) => {
      const result = response.data!.deleteSuggestion
      if (result.__typename === 'OBugsError') {
        const error = result as OBugsError;
        console.log(error)
      } else {
        const user = result as OperationDone;
        this.suggestions = this.suggestions.filter((suggestion) => suggestion.id != this.selectedSuggestion?.id)
        this.selectedSuggestion = null;
      }
    })
  }
}
