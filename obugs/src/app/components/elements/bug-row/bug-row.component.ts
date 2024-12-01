import { Component, Input } from '@angular/core';
import { Entry, Tag } from 'src/app/models/models';

@Component({
    selector: 'app-bug-row',
    templateUrl: './bug-row.component.html',
    styleUrls: ['./bug-row.component.scss'],
    standalone: false
})
export class BugRowComponent {

  @Input({ required: true })
  entry!: Entry;
}
