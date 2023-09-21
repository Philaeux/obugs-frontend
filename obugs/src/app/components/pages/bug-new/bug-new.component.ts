import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Software, Tag } from 'src/app/models/models';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { QUERY_LIST_TAGS, QueryResponseListTags } from "src/app/models/graphql/queries";
import { MUTATION_CREATE_ENTRY, MutationResponseCreatEntry } from "src/app/models/graphql/mutations";
import { MatChipEditedEvent, MatChipGrid, MatChipInput, MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInput } from '@angular/material/input';


@Component({
  selector: 'app-bug-new',
  templateUrl: './bug-new.component.html',
  styleUrls: ['./bug-new.component.scss']
})
export class BugNewComponent {


  softwareId: string | null = null;
  softwareTags: string[] = [];

  @ViewChild("autoComple") autoComple: MatAutocomplete | undefined;
  @ViewChild("chipInput") chipInput: MatInput | undefined;

  form: FormGroup;
  selectedTags: string[] = [];
  suggestedTags: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private apollo: Apollo,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      illustration: ['']
    });
  }

  ngOnInit(): void {
    this.softwareId = this.route.snapshot.paramMap.get("software");
    this.apollo
      .query<QueryResponseListTags>({
        query: QUERY_LIST_TAGS,
        variables: {
          softwareId: this.softwareId
        }
      })
      .subscribe((response) => {
        this.softwareTags = []
        for (var tag of response.data.tags) {
          this.softwareTags.push(tag.name);
        };
      });
  }

  onSeparatorKey(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    this.addTag(value);
  }

  addTag(tag: string): void {
    const index = this.softwareTags.indexOf(tag);
    if (index != -1) {
      this.selectedTags.push(tag);
      this.softwareTags.splice(index, 1);
    }
  }

  removeTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
      this.softwareTags.push(tag);
      this.softwareTags.sort();
    }
  }

  filterTagSuggestions(event: any): void {
    const value = event.target.value.toLowerCase();
    this.suggestedTags = this.softwareTags.filter(
      (tag) => tag.toLowerCase().includes(value)
    );
  }

  onTagOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.addTag(event.option.value);
  }

  onSubmit() {
    if (this.form.valid) {
      this.apollo
        .mutate<MutationResponseCreatEntry>({
          mutation: MUTATION_CREATE_ENTRY,
          variables: {
            softwareId: this.softwareId,
            title: this.form.value.title,
            description: this.form.value.description,
            illustration: this.form.value.illustration,
            tags: this.selectedTags
          }
        })
        .subscribe((response) => {
          this.router.navigate(["/s/" + response.data?.createEntry.softwareId + "/" + response.data?.createEntry.id]);
        });
    }
  }
}
