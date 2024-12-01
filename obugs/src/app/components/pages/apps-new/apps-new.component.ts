import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiError, SoftwareSuggestion, User } from 'src/app/models/models';
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

    this.auth.currentUser$.pipe(untilDestroyed(this)).subscribe((user) => {
      if (user === undefined) return;
      this.currentUser = user;
    })
  }

  onCreateButton() {
    this.error = ""
    this.message = ""
    this.submitSoftware()
  }

  submitSoftware() {
    this.api.softwareSuggestionAdd(token, this.form.value.name, this.form.value.description).subscribe((response) => {
      if (response.data && response.data.suggestSoftware) {
        const result = response.data.suggestSoftware
        if (result.__typename === 'ApiError') {
          const error = result as ApiError;
          this.error = error.message;
        } else {
          const suggestion = result as SoftwareSuggestion;
          this.message = "Software suggestion has been sent to admins."
        }
      }
    })
  }
}
