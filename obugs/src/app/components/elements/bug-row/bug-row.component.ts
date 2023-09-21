import { Component, Input } from '@angular/core';
import { Entry, Tag } from 'src/app/models/models';

@Component({
  selector: 'app-bug-row',
  templateUrl: './bug-row.component.html',
  styleUrls: ['./bug-row.component.scss']
})
export class BugRowComponent {

  @Input({ required: true })
  entry!: Entry;

  chipStyle(tag: Tag) {
    const styles = {
      'color': tag.fontColor,
      'background-color': tag.backgroundColor
    }
    return styles
  }
}
