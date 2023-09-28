import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { QUERY_LIST_TAGS, QueryResponseListTags } from "src/app/models/graphql/queries";
import { MUTATION_CREATE_ENTRY, MutationResponseCreatEntry } from "src/app/models/graphql/mutations";
import { environment } from 'src/environments/environment';
import { ReCaptcha2Component } from 'ngx-captcha';
import { Error, Entry } from 'src/app/models/models';


@Component({
  selector: 'app-bug-new',
  templateUrl: './bug-new.component.html',
  styleUrls: ['./bug-new.component.scss']
})
export class BugNewComponent {


  softwareId: string | null = null;
  softwareTags: string[] = [];
  errorMessage: string = "";

  form: FormGroup;
  selectedTags: string[] = [];
  siteKey: string = environment.recaptchaSiteKey;
  @ViewChild('captchaRef', { static: false }) captchaRef!: ReCaptcha2Component;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private apollo: Apollo,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      illustration: [''],
      recaptcha: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.softwareId = this.route.snapshot.paramMap.get("software");
    this.apollo
      .query<QueryResponseListTags>({
        query: QUERY_LIST_TAGS,
        variables: {
          softwareId: this.softwareId
        }
      })
      .subscribe((response) => {
        this.softwareTags = []
        for (var tag of response.data.tags) {
          this.softwareTags.push(tag.name);
        };
      });
  }

  onSubmit() {
    this.errorMessage = '';
    if (this.form.valid) {
      this.apollo
        .mutate<MutationResponseCreatEntry>({
          mutation: MUTATION_CREATE_ENTRY,
          variables: {
            recaptcha: this.form.value.recaptcha,
            softwareId: this.softwareId,
            title: this.form.value.title,
            description: this.form.value.description,
            illustration: this.form.value.illustration,
            tags: this.selectedTags
          }
        })
        .subscribe((response) => {
          this.captchaRef.resetCaptcha();
          if (response.data && response.data.createEntry) {
            const result = response.data.createEntry
            if (result.__typename === 'Error') {
              const error = result as Error;
              this.errorMessage = error.message;
            } else {
              const entry = result as Entry
              this.router.navigate(["/s/" + entry.softwareId + "/" + entry.id]);
            }
          }
        })
    }
  }
}
