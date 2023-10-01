import { TestBed } from '@angular/core/testing';

import { Recaptchav2Service } from './recaptchav2.service';

describe('Recaptchav2Service', () => {
  let service: Recaptchav2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Recaptchav2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
