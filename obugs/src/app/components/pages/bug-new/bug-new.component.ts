import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { ApiError, Entry } from 'src/app/models/models';
import { Recaptchav2Service } from 'src/app/services/recaptchav2.service';
import { Title } from '@angular/platform-browser';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'app-bug-new',
    templateUrl: './bug-new.component.html',
    styleUrls: ['./bug-new.component.scss'],
    standalone: false
})
export class BugNewComponent implements OnInit {

  softwareId: string | null = null;
  softwareTags: string[] = [];
  errorMessage: string = "";

  form: FormGroup;
  selectedTags: string[] = [];

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private recaptchav2Service: Recaptchav2Service,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      illustration: ['']
    });
  }

  ngOnInit(): void {
    this.recaptchav2Service.recaptchav2$.pipe(untilDestroyed(this)).subscribe((token) => {
      this.onSubmit(token)
    });

    this.softwareId = this.route.snapshot.paramMap.get("software");
    this.title.setTitle("oBugs - " + this.softwareId + " - New Entry")
    if (this.softwareId == null) return
    this.api.tagList(this.softwareId, '').subscribe((response) => {
      this.softwareTags = []
      for (var tag of response.data.tags) {
        this.softwareTags.push(tag.name);
      };
    });
  }

  onCreateButton() {
    grecaptcha.execute()
  }

  onSubmit(token: string) {
    this.errorMessage = ''
    if (this.form.valid && this.softwareId != null) {
      this.api.entryAdd(
        token,
        this.softwareId,
        this.form.value.title,
        this.form.value.description,
        this.form.value.illustration,
        this.selectedTags
      ).subscribe((response) => {
        grecaptcha.reset()
        if (response.data && response.data.createEntry) {
          const result = response.data.createEntry
          if (result.__typename === 'ApiError') {
            const error = result as ApiError
            this.errorMessage = error.message
          } else {
            const entry = result as Entry
            this.router.navigate(["/s/" + entry.softwareId + "/" + entry.id])
          }
        }
      })
    }
  }
}
