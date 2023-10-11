import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { MUTATION_SUGGEST_SOFTWARE, MutationResponseSuggestSoftware } from 'src/app/models/graphql/mutations/software';
import { OBugsError, SoftwareSuggestion } from 'src/app/models/models';
import { Recaptchav2Service } from 'src/app/services/recaptchav2.service';

@Component({
  selector: 'app-apps-new',
  templateUrl: './apps-new.component.html',
  styleUrls: ['./apps-new.component.scss']
})
export class AppsNewComponent implements OnInit, OnDestroy {

  subscription: Subscription | null = null;
  form: FormGroup;
  error: string = "";
  message: string = "";

  constructor(
    public fb: FormBuilder,
    private recaptchav2Service: Recaptchav2Service,
    private apollo: Apollo
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(3000)]]
    });
  }

  ngOnInit(): void {
    this.subscription = this.recaptchav2Service.recaptchav2$.subscribe((token) => {
      this.submitSoftware(token);
    });
  }

  public ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe()
  }

  onCreateButton() {
    this.error = ""
    this.message = ""
    if (this.form.valid) {
      grecaptcha.execute();
    }
  }

  submitSoftware(token: string) {
    this.apollo.mutate<MutationResponseSuggestSoftware>({
      mutation: MUTATION_SUGGEST_SOFTWARE,
      variables: {
        recaptcha: token,
        name: this.form.value.name,
        description: this.form.value.description
      }
    }).subscribe((response) => {
      if (response.data && response.data.suggestSoftware) {
        const result = response.data.suggestSoftware
        if (result.__typename === 'OBugsError') {
          const error = result as OBugsError;
          this.error = error.message;
        } else {
          const suggestion = result as SoftwareSuggestion;
          this.message = "Software suggestion has been sent to admins."
        }
      }
    })
    grecaptcha.reset()
  }
}
