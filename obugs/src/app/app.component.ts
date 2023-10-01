import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Recaptchav2Service } from './services/recaptchav2.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'oBugs';
  siteKey: string = environment.recaptchaSiteKey;

  constructor(private captchav2Service: Recaptchav2Service) { }

  public resolved(captchaResponse: string): void {
    this.captchav2Service.recaptchav2Resolved(captchaResponse);
  }
}
