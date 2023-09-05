import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Software } from 'src/app/models/models';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { SoftwareService } from 'src/app/services/software.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BugNewPayload } from 'src/app/models/models';

@Component({
  selector: 'app-bug-new',
  templateUrl: './bug-new.component.html',
  styleUrls: ['./bug-new.component.scss']
})
export class BugNewComponent {

  form: UntypedFormGroup = new UntypedFormGroup({
    title: new UntypedFormControl(''),
    description: new UntypedFormControl(''),
  });
  softwareId: string | undefined;
  software: Software | undefined;

  constructor(private fb: UntypedFormBuilder, private router: Router, private route: ActivatedRoute,
    private softwareService: SoftwareService, private http: HttpClient) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
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
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const { title, description } = this.form.value;
      const payload = {
        software: this.softwareId,
        title: title,
        description: description
      }
      this.http.post<BugNewPayload>(environment.apiUrl + '/api/bug', payload).subscribe(
        response => {
          if (response.error == null) {
            this.router.navigate(["/s/" + this.softwareId + "/bug/" + response.payload.id]);
          } else {
            console.log(response);
          }
        });
    }
  }
}
