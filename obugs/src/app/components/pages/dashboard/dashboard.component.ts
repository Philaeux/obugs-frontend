import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Software} from "../../../models/software";
import {SoftwaresService} from "../../../services/softwares.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  softwareId: string | undefined;
  software: Software | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private softwaresService: SoftwaresService
  ) {
  }

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
