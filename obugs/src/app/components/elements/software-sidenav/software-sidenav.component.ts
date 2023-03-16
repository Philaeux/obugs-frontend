import { Component, Input } from '@angular/core';
import { Software } from 'src/app/models/models';

@Component({
  selector: 'app-software-sidenav',
  templateUrl: './software-sidenav.component.html',
  styleUrls: ['./software-sidenav.component.scss']
})
export class SoftwareSidenavComponent {

  @Input()
  software: Software | undefined;

}
