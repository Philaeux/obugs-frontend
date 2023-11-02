import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { OBugsError, Entry } from 'src/app/models/models';
import { Recaptchav2Service } from 'src/app/services/recaptchav2.service';
import { Subscription } from 'rxjs'
import { Title } from '@angular/platform-browser';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-bug-new',
  templateUrl: './bug-new.component.html',
  styleUrls: ['./bug-new.component.scss']
})
export class BugNewComponent implements OnInit, OnDestroy {

  subscription: Subscription | null = null;

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
    this.subscription = this.recaptchav2Service.recaptchav2$.subscribe((token) => {
      this.onSubmit(token)
    });

    this.softwareId = this.route.snapshot.paramMap.get("software");
    this.title.setTitle("oBugs - " + this.softwareId + " - New Entry")
    if (this.softwareId == undefined) return
    this.api.tagList(this.softwareId, '').subscribe((response) => {
      this.softwareTags = []
      for (var tag of response.data.tags) {
        this.softwareTags.push(tag.name);
      };
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe()
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
          if (result.__typename === 'OBugsError') {
            const error = result as OBugsError
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
