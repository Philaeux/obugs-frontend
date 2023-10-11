import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { QUERY_LIST_TAGS, QueryResponseListTags } from "src/app/models/graphql/queries/tag";
import { OBugsError, Entry } from 'src/app/models/models';
import { Subscription } from 'rxjs'
import { Recaptchav2Service } from 'src/app/services/recaptchav2.service';
import { MUTATION_CREATE_ENTRY, MutationResponseCreateEntry } from 'src/app/models/graphql/mutations/entry';
import { Title } from '@angular/platform-browser';


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
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private apollo: Apollo,
    private router: Router,
    private recaptchav2Service: Recaptchav2Service,
    private title: Title
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

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe()
  }

  onCreateButton() {
    grecaptcha.execute()
  }

  onSubmit(token: string) {
    this.errorMessage = '';
    if (this.form.valid) {
      this.apollo
        .mutate<MutationResponseCreateEntry>({
          mutation: MUTATION_CREATE_ENTRY,
          variables: {
            recaptcha: token,
            softwareId: this.softwareId,
            title: this.form.value.title,
            description: this.form.value.description,
            illustration: this.form.value.illustration,
            tags: this.selectedTags
          }
        })
        .subscribe((response) => {
          if (response.data && response.data.createEntry) {
            const result = response.data.createEntry
            if (result.__typename === 'OBugsError') {
              const error = result as OBugsError;
              this.errorMessage = error.message;
            } else {
              const entry = result as Entry
              this.router.navigate(["/s/" + entry.softwareId + "/" + entry.id]);
            }
          }
        })
      grecaptcha.reset()
    }
  }
}
