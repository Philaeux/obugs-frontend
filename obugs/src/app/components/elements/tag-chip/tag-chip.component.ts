import { Component, Input } from '@angular/core';
import { Tag } from 'src/app/models/models';

@Component({
  selector: 'app-tag-chip',
  templateUrl: './tag-chip.component.html',
  styleUrls: ['./tag-chip.component.scss']
})
export class TagChipComponent {

  @Input({ required: true })
  tag!: Tag;

  chipStyle() {
    return {
      'color': this.tag.fontColor,
      'background-color': this.tag.backgroundColor
    }
  }
}
