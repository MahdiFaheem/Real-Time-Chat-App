import { TestBed } from '@angular/core/testing';

import { CredentialServiceService } from './credential-service.service';

describe('CredentialServiceService', () => {
  let service: CredentialServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CredentialServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
