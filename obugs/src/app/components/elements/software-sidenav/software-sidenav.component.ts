import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-software-sidenav',
  templateUrl: './software-sidenav.component.html',
  styleUrls: ['./software-sidenav.component.scss']
})
export class SoftwareSidenavComponent {

  @Input()
  softwareId: string | undefined;
}
