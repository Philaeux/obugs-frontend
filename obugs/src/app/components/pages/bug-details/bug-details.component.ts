import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Bug, BugDetailsPayload, BugVotePayload } from 'src/app/models/models';
import { Software } from 'src/app/models/models';
import { SoftwareService } from 'src/app/services/software.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bug-details',
  templateUrl: './bug-details.component.html',
  styleUrls: ['./bug-details.component.scss']
})
export class BugDetailsComponent implements OnInit {
  softwareId?: string;
  software?: Software;
  bugId?: string;
  bug?: Bug;
  myVote?: string;

  constructor(private router: Router, private route: ActivatedRoute,
    private softwareService: SoftwareService, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let softwareId = params.get('software');
      if (softwareId != null) {
        this.softwareId = softwareId;
        this.softwareService.getSoftwareDetails(this.softwareId).subscribe(data => {
          if (data.payload == null) {
            this.router.navigate(["/"]);
          } else {
            this.software = data.payload;
          }
        });
      }

      let bugId = params.get('bug');
      if (bugId != null) {
        this.bugId = bugId;
        this.http.get<BugDetailsPayload>(environment.apiUrl + "/api/bug/" + this.bugId + "/").subscribe(data => {
          if (data.payload == null) {
            this.router.navigate(["/s/" + this.softwareId]);
          } else {
            this.bug = data.payload;
            this.http.get<BugVotePayload>(environment.apiUrl + "/api/bug_vote/" + this.bugId + "/").subscribe(data => {
              if (data.error == null && data.payload != 0) {
                console.log(data);
                this.myVote = data.payload?.toString();
              }
            })
          }
        });
      }
    });
  }

  onVoteChange(): void {
    this.http.post<BugDetailsPayload>(environment.apiUrl + "/api/bug_vote/" + this.bugId + "/", { "vote": this.myVote }).subscribe(data => {
      if (data.payload != null) {
        this.bug = data.payload;
      }
    });
  };

}
