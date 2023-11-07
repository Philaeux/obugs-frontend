import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OBugsError, SoftwareSuggestion, User } from 'src/app/models/models';
import { Recaptchav2Service } from 'src/app/services/recaptchav2.service';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-apps-new',
  templateUrl: './apps-new.component.html',
  styleUrls: ['./apps-new.component.scss']
})
export class AppsNewComponent implements OnInit {

  form: FormGroup;
  error: string = "";
  message: string = "";

  currentUser: User | null = null;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private recaptchav2Service: Recaptchav2Service,
    private title: Title,
    public fb: FormBuilder,
  ) {
    this.title.setTitle('oBugs - Suggest a new Software')
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(3000)]]
    });
  }

  ngOnInit(): void {
    this.recaptchav2Service.recaptchav2$.pipe(untilDestroyed(this)).subscribe((token) => {
      this.submitSoftware(token);
    });

    this.auth.currentUser$.pipe(untilDestroyed(this)).subscribe((user) => {
      if (user === undefined) return;
      this.currentUser = user;
    })
  }

  onCreateButton() {
    this.error = ""
    this.message = ""
    if (this.form.valid) {
      grecaptcha.execute();
    }
  }

  submitSoftware(token: string) {
    this.api.softwareSuggestionAdd(token, this.form.value.name, this.form.value.description).subscribe((response) => {
      grecaptcha.reset()
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
