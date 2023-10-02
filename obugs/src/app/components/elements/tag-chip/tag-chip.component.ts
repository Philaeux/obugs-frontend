import { Component, Input, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { QUERY_LIST_TAGS, QueryResponseListTags } from "src/app/models/graphql/queries/tag";
import { Tag } from 'src/app/models/models';

@Component({
  selector: 'app-tag-chip',
  templateUrl: './tag-chip.component.html',
  styleUrls: ['./tag-chip.component.scss']
})
export class TagChipComponent {

  @Input()
  tag!: Tag;

  @Input()
  tagName!: string;

  @Input({ required: true })
  softwareTags!: Tag[];

  chipStyle() {
    if (this.tagName) {
      let targetTag = null;
      for (let tag of this.softwareTags) {
        if (tag.name == this.tagName) {
          targetTag = tag;
        }
      }
      if (targetTag) {
        return {
          'color': targetTag.fontColor,
          'background-color': targetTag.backgroundColor
        }
      } else {
        return {}
      }
    } else {
      if (this.tag) {
        return {
          'color': this.tag.fontColor,
          'background-color': this.tag.backgroundColor,
        }
      } else {
        return {}
      }
    }
  }
}
