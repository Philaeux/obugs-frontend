import { TestBed } from '@angular/core/testing';

import { SoftwaresService } from './softwares.service';

describe('SoftwaresService', () => {
  let service: SoftwaresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoftwaresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
