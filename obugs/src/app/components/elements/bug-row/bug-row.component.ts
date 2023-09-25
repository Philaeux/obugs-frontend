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

  @Input({ required: true })
  softwareTags!: Tag[];
}
