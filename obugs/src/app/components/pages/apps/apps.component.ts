import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Software } from 'src/app/models/models';
import { Title } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss']
})
export class AppsComponent {
  softwares: Software[] = [];
  softwareFilter: string = "";

  constructor(
    private api: ApiService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
  ) {
    this.title.setTitle('oBugs - Applications')
  }

  ngOnInit(): void {
    const search = this.route.snapshot.queryParams['search'];
    if (search != undefined) this.softwareFilter = search

    this.refreshListSoftware();
  }

  selectSoftware(software: string) {
    this.router.navigate(["/s/" + software]);
  }

  refreshListSoftware() {
    if (this.softwareFilter != '') {
      this.location.go(location.pathname, new URLSearchParams({ search: this.softwareFilter }).toString())
    } else {
      this.location.go(location.pathname)
    }

    this.api.softwareList(this.softwareFilter).subscribe((response) => {
      this.softwares = response.data.softwares;
    });
  }

  onEnterKey() {
    this.refreshListSoftware();
  }
}
