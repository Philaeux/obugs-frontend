import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.scss']
})
export class TagInputComponent {

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  @Input({ required: true })
  softwareTags: string[] = [];
  @Input({ required: true })
  selectedTags: string[] = [];

  suggestedTags: string[] = [];


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

  onTagOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.addTag(event.option.value);
  }

  filterTagSuggestions(event: any): void {
    const value = event.target.value.toLowerCase();
    this.suggestedTags = this.softwareTags.filter(
      (tag) => tag.toLowerCase().includes(value)
    );
  }

  removeTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
      this.softwareTags.push(tag);
      this.softwareTags.sort();
    }
  }

}
