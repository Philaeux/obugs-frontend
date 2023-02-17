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

  softwareCode: string | undefined;
  software: Software | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private softwaresService: SoftwaresService
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let code = params.get('software');
      if (code != null) {
        this.softwareCode = code;
        this.softwaresService.getSoftwareDetails(this.softwareCode).subscribe(data => {
          if (data.length != 1) {
            this.router.navigate(["/"]);
          } else {
            this.software = data[0];
          }
        });
      }
    });
  }

}
