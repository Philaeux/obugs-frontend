import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Software, OBugsError, Tag, EntryMessage, SoftwareSuggestion, OperationDone } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, interval, timer } from 'rxjs'
import { Apollo } from 'apollo-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MUTATION_DELETE_SUGGESTION, MUTATION_UPSERT_SOFTWARE, MutationResponseDeleteSuggestion, MutationResponseUpsertSoftware } from 'src/app/models/graphql/mutations/software';
import { MUTATION_UPSERT_TAG, MutationResponseUpsertTag } from 'src/app/models/graphql/mutations/tag';
import { QUERY_LIST_SOFTWARE, QUERY_LIST_SOFTWARE_SUGGESTIONS, QueryResponseListSoftware, QueryResponseListSoftwareSuggestions } from 'src/app/models/graphql/queries/software';
import { Title } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  softwares: Software[] = [];
  softwareFilter: string = "";
  softwareEditForm: FormGroup;

  tags: Tag[] = [];
  tagSoftwareFilter: string = "";
  tagNameFilter: string = "";
  tagEditForm: FormGroup;

  patches: EntryMessage[] = [];
  patchSoftwareFilter: string = "";

  suggestions: SoftwareSuggestion[] = [];
  selectedSuggestion: SoftwareSuggestion | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private apollo: Apollo,
    private title: Title,
    private api: ApiService
  ) {
    this.title.setTitle('oBugs - Admin')
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
    this.auth.currentUser$.pipe(untilDestroyed(this)).subscribe((user) => {
      if (user === undefined) return;
      if (user === null || !user.isAdmin) {
        this.router.navigate([`/`]);
      }
    })

    timer(0, 60000 * 5).pipe(untilDestroyed(this)).subscribe(() => {
      this.refreshPatchList()
      this.refreshSuggestionList()
    })
  }

  updateTitle(): void {
    if (this.patches.length + this.suggestions.length != 0) {
      this.title.setTitle('(' + (this.patches.length + this.suggestions.length) + ') oBugs - Admin')
    } else {
      this.title.setTitle('oBugs - Admin')
    }
  }

  refreshSoftwareList() {
    let search: string | null = null;
    if (this.softwareFilter != '') {
      search = this.softwareFilter;
    }
    this.apollo
      .query<QueryResponseListSoftware>({
        query: QUERY_LIST_SOFTWARE,
        variables: {
          search: search
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
    this.api.tagList(this.tagSoftwareFilter, this.tagNameFilter).subscribe((response) => {
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
    this.api.patchListOpen(this.patchSoftwareFilter).subscribe((response) => {
      this.patches = response.data.openPatches
      this.updateTitle()
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
      this.updateTitle()
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
