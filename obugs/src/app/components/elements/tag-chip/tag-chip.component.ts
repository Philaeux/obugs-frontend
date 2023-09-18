import { Component, Input } from '@angular/core';
import { Tag } from 'src/app/models/models';

@Component({
  selector: 'app-tag-chip',
  templateUrl: './tag-chip.component.html',
  styleUrls: ['./tag-chip.component.scss']
})
export class TagChipComponent {

  @Input()
  tag: Tag | undefined;

  chipStyle() {
    if (this.tag) {
      return {
        'color': this.tag.fontColor,
        'background-color': this.tag.backgroundColor
      }
    }
    else {
      return {}
    }

  }
}
