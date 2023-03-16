import { Component, Input } from '@angular/core';
import { Bug } from 'src/app/models/models';

@Component({
  selector: 'app-bug-row',
  templateUrl: './bug-row.component.html',
  styleUrls: ['./bug-row.component.scss']
})
export class BugRowComponent {

  @Input()
  bug: Bug | undefined;

}
