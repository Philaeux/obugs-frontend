import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Software } from 'src/app/models/software';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SoftwaresService } from 'src/app/services/softwares.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BugNewPayload } from 'src/app/models/bug';

@Component({
  selector: 'app-bug-new',
  templateUrl: './bug-new.component.html',
  styleUrls: ['./bug-new.component.scss']
})
export class BugNewComponent {

  form: FormGroup = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
  });
  softwareId: string | undefined;
  software: Software | undefined;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
    private softwaresService: SoftwaresService, private http: HttpClient) {
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
