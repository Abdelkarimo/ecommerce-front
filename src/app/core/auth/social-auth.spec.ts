import { TestBed } from '@angular/core/testing';

import { SocialAuth } from './social-auth';

describe('SocialAuth', () => {
  let service: SocialAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialAuth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
