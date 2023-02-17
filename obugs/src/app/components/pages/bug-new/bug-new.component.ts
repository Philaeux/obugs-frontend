import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Software } from 'src/app/models/software';
import { SoftwaresService } from 'src/app/services/softwares.service';

@Component({
  selector: 'app-bug-new',
  templateUrl: './bug-new.component.html',
  styleUrls: ['./bug-new.component.scss']
})
export class BugNewComponent {

  softwareId: string | undefined;
  software: Software | undefined;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private softwaresService: SoftwaresService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let softwareId = params.get('software');
      if (softwareId != null) {
        this.softwareId = softwareId;
        this.softwaresService.getSoftwareDetails(this.softwareId).subscribe(data => {
          if (data.payload == null) {
            this.router.navigate(["/"]);
          } else {
            this.software = data.payload;
          }
        });
      }
    });
  }

}
