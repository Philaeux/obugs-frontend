import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Software, OBugsError, Tag, EntryMessage, SoftwareSuggestion, OperationDone } from 'src/app/models/models';
import { timer } from 'rxjs'
import { Title } from '@angular/platform-browser';
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
    private api: ApiService,
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private title: Title,
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
    this.api.softwareList(this.softwareFilter).subscribe((response) => {
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
      this.api.softwareUpsert(
        this.softwareEditForm.value.id,
        this.softwareEditForm.value.fullName,
        this.softwareEditForm.value.editor,
        this.softwareEditForm.value.language,
        this.softwareEditForm.value.description,
      ).subscribe((response) => {
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
    if (this.tagEditForm.valid) {
      this.api.tagUpsert(
        this.tagEditForm.value.id,
        this.tagEditForm.value.softwareId,
        this.tagEditForm.value.name,
        this.tagEditForm.value.fontColor,
        this.tagEditForm.value.backgroundColor,
      ).subscribe((response) => {
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
    this.api.softwareSuggestionList().subscribe((response) => {
      this.suggestions = response.data.softwareSuggestions
      this.updateTitle()
    })
  }

  onSuggestionSelect(row: SoftwareSuggestion) {
    this.selectedSuggestion = row
  }

  deleteSuggestion() {
    if (this.selectedSuggestion != null) {
      this.api.softwareSuggestionDelete(this.selectedSuggestion.id).subscribe((response) => {
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
}
