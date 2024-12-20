import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-status-chip',
    templateUrl: './status-chip.component.html',
    styleUrls: ['./status-chip.component.scss'],
    standalone: false
})
export class StatusChipComponent {

  @Input({ required: true })
  status!: string;
}
