import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Recaptchav2Service {
  private recaptchav2 = new Subject<string>();
  recaptchav2$ = this.recaptchav2.asObservable();

  constructor() { }

  recaptchav2Resolved(token: string) {
    this.recaptchav2.next(token);
  }
}
